import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.adminUser.create({
    data: {
      username: 'admin',
      email: 'admin@movieflix.com',
      password: 'admin123', // In production, use hashed passwords
      role: 'admin'
    }
  });

  console.log('Admin user created:', adminUser.username);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Hollywood',
        slug: 'hollywood',
        description: 'Latest Hollywood movies and blockbusters',
        contentType: 'MOVIE'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bollywood',
        slug: 'bollywood',
        description: 'Bollywood movies and Indian cinema',
        contentType: 'MOVIE'
      }
    }),
    prisma.category.create({
      data: {
        name: 'South Indian',
        slug: 'south-indian',
        description: 'South Indian movies in Tamil, Telugu, Malayalam, and Kannada',
        contentType: 'MOVIE'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Marvel',
        slug: 'marvel',
        description: 'Marvel Cinematic Universe movies and series',
        contentType: 'MOVIE'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Web Series',
        slug: 'web-series',
        description: 'Popular web series from around the world',
        contentType: 'WEB_SERIES'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Action',
        slug: 'action',
        description: 'High-octane action movies',
        contentType: 'MOVIE'
      }
    })
  ]);

  console.log('Categories created:', categories.length);

  // Create sample content
  const sampleContent = [
    {
      title: 'Inception',
      description: 'A mind-bending thriller about dream infiltration and the power of the subconscious mind.',
      posterUrl: 'https://images.unsplash.com/photo-1489599904447-b47de73b2377?w=300&h=450&fit=crop',
      year: 2010,
      duration: '2h 28m',
      rating: 8.8,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/inception',
      contentType: 'MOVIE' as const,
      categoryId: categories[0].id // Hollywood
    },
    {
      title: 'The Dark Knight',
      description: 'Batman faces the Joker in this epic superhero thriller that redefined the genre.',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      year: 2008,
      duration: '2h 32m',
      rating: 9.0,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/darkknight',
      contentType: 'MOVIE' as const,
      categoryId: categories[0].id // Hollywood
    },
    {
      title: 'Avengers: Endgame',
      description: 'The epic conclusion to the Infinity Saga, bringing together all Marvel heroes.',
      posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=450&fit=crop',
      year: 2019,
      duration: '3h 1m',
      rating: 8.4,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/endgame',
      contentType: 'MOVIE' as const,
      categoryId: categories[3].id // Marvel
    },
    {
      title: 'Dangal',
      description: 'Based on the true story of Mahavir Singh Phogat and his daughters who became wrestling champions.',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
      year: 2016,
      duration: '2h 49m',
      rating: 8.4,
      quality: 'FULL_HD',
      telegramUrl: 'https://t.me/moviflixpro/dangal',
      contentType: 'MOVIE' as const,
      categoryId: categories[1].id // Bollywood
    },
    {
      title: 'Baahubali 2',
      description: 'The conclusion to the epic Indian fantasy action film.',
      posterUrl: 'https://images.unsplash.com/photo-1489599904447-b47de73b2377?w=300&h=450&fit=crop',
      year: 2017,
      duration: '2h 47m',
      rating: 8.2,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/baahubali2',
      contentType: 'MOVIE' as const,
      categoryId: categories[2].id // South Indian
    },
    {
      title: 'Stranger Things',
      description: 'Kids in a small town face supernatural forces in this thrilling Netflix series.',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
      year: 2016,
      duration: '4 Seasons',
      rating: 8.7,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/strangerthings',
      contentType: 'WEB_SERIES' as const,
      categoryId: categories[4].id // Web Series
    },
    {
      title: 'John Wick 4',
      description: 'John Wick uncovers a path to defeating the High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
      posterUrl: 'https://images.unsplash.com/photo-1489599904447-b47de73b2377?w=300&h=450&fit=crop',
      year: 2023,
      duration: '2h 49m',
      rating: 7.8,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/johnwick4',
      contentType: 'MOVIE' as const,
      categoryId: categories[5].id // Action
    },
    {
      title: 'RRR',
      description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country.',
      posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
      year: 2022,
      duration: '3h 7m',
      rating: 8.0,
      quality: 'FOUR_K',
      telegramUrl: 'https://t.me/moviflixpro/rrr',
      contentType: 'MOVIE' as const,
      categoryId: categories[2].id // South Indian
    }
  ];

  const content = await Promise.all(
    sampleContent.map(item => prisma.content.create({ data: item }))
  );

  console.log('Sample content created:', content.length);
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });