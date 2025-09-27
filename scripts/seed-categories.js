const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  const categories = [
    {
      name: 'Action',
      slug: 'action',
      description: 'High-energy movies with lots of stunts and fighting',
      contentType: 'MOVIE'
    },
    {
      name: 'Comedy',
      slug: 'comedy',
      description: 'Funny movies that make you laugh',
      contentType: 'MOVIE'
    },
    {
      name: 'Drama',
      slug: 'drama',
      description: 'Serious movies with emotional stories',
      contentType: 'MOVIE'
    },
    {
      name: 'Horror',
      slug: 'horror',
      description: 'Scary movies to give you chills',
      contentType: 'MOVIE'
    },
    {
      name: 'Romance',
      slug: 'romance',
      description: 'Love stories and romantic comedies',
      contentType: 'MOVIE'
    },
    {
      name: 'Thriller',
      slug: 'thriller',
      description: 'Suspenseful movies that keep you on edge',
      contentType: 'MOVIE'
    },
    {
      name: 'Action Series',
      slug: 'action-series',
      description: 'High-energy web series with lots of action',
      contentType: 'WEB_SERIES'
    },
    {
      name: 'Comedy Series',
      slug: 'comedy-series',
      description: 'Funny web series that make you laugh',
      contentType: 'WEB_SERIES'
    },
    {
      name: 'Drama Series',
      slug: 'drama-series',
      description: 'Serious web series with emotional stories',
      contentType: 'WEB_SERIES'
    },
    {
      name: 'Documentary Series',
      slug: 'documentary-series',
      description: 'Educational and informative web series',
      contentType: 'WEB_SERIES'
    }
  ];

  for (const category of categories) {
    try {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      });
      console.log(`Created/updated category: ${category.name}`);
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });