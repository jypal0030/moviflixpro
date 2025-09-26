import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Categories API called');
    
    // Try to get from database
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('Categories found:', categories.length);
    return Response.json(categories);
    
  } catch (error) {
    console.error('Categories API Error:', error);
    
    // Fallback data if database fails
    const fallbackCategories = [
      { 
        id: 'action', 
        name: 'Action', 
        slug: 'action', 
        description: 'Action Movies',
        contentType: 'MOVIE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'comedy', 
        name: 'Comedy', 
        slug: 'comedy', 
        description: 'Comedy Movies',
        contentType: 'MOVIE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'drama', 
        name: 'Drama', 
        slug: 'drama', 
        description: 'Drama Movies',
        contentType: 'MOVIE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'horror', 
        name: 'Horror', 
        slug: 'horror', 
        description: 'Horror Movies',
        contentType: 'MOVIE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    console.log('Using fallback categories');
    return Response.json(fallbackCategories);
  }
}