import { db } from '@/lib/db';
import { MemoryStorage } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
    
    let allContent: any[] = [];
    
    // Try to get from database first
    try {
      const whereClause: any = { contentType: type };
      if (categoryId) {
        whereClause.categoryId = categoryId;
      }
      
      const dbContent = await db.content.findMany({
        where: whereClause,
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      allContent = dbContent;
      console.log('Database content found:', dbContent.length);
    } catch (dbError) {
      console.log('Database error, using fallback data:', dbError);
    }
    
    // Get content from memory storage
    const storage = MemoryStorage.getInstance();
    const memoryContent = storage.getContent(type, categoryId);
    console.log('Memory content found:', memoryContent.length);
    
    // Combine database and memory content
    const combinedContent = [...memoryContent, ...allContent];
    
    // Remove duplicates (based on title)
    const uniqueContent = combinedContent.filter((item, index, self) => 
      index === self.findIndex((t) => t.title === item.title)
    );
    
    console.log('Total unique content returned:', uniqueContent.length);
    return Response.json(uniqueContent);
    
  } catch (error) {
    console.error('Content API Error:', error);
    
    // Ultimate fallback
    return Response.json([]);
  }
}