import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    console.log('Content API called');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const categoryId = searchParams.get('category');
    
    console.log('Content request - Type:', type, 'Category:', categoryId);
    
    // Validate type parameter
    if (!type || (type !== 'MOVIE' && type !== 'WEB_SERIES')) {
      return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
    
    // Try to get from database
    const whereClause: any = { contentType: type };
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    const content = await db.content.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('Content found:', content.length);
    return Response.json(content);
    
  } catch (error) {
    console.error('Content API Error:', error);
    
    // Fallback data if database fails
    const fallbackContent = [
      {
        id: 'movie1',
        title: 'Sample Action Movie',
        description: 'An exciting action movie',
        posterUrl: 'https://via.placeholder.com/300x450',
        year: 2024,
        duration: '120 min',
        rating: 8.5,
        quality: 'HD',
        telegramUrl: '#',
        contentType: 'MOVIE',
        categoryId: 'action',
        category: {
          id: 'action',
          name: 'Action',
          slug: 'action'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'movie2',
        title: 'Sample Comedy Movie',
        description: 'A hilarious comedy movie',
        posterUrl: 'https://via.placeholder.com/300x450',
        year: 2024,
        duration: '90 min',
        rating: 7.8,
        quality: 'HD',
        telegramUrl: '#',
        contentType: 'MOVIE',
        categoryId: 'comedy',
        category: {
          id: 'comedy',
          name: 'Comedy',
          slug: 'comedy'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    console.log('Using fallback content');
    return Response.json(fallbackContent);
  }
}