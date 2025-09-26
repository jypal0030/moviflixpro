import { db } from '@/lib/db';
import { MemoryStorage } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Admin content save request:', body);
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'contentType', 'categoryId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `${field} is required` 
        }, { status: 400 });
      }
    }

    // Try to save to database first
    try {
      const content = await db.content.create({
        data: {
          title: body.title,
          description: body.description,
          posterUrl: body.posterUrl || 'https://via.placeholder.com/300x450',
          year: parseInt(body.year) || new Date().getFullYear(),
          duration: body.duration || '120 min',
          rating: parseFloat(body.rating) || 8.0,
          quality: body.quality || 'HD',
          telegramUrl: body.telegramUrl || '#',
          contentType: body.contentType,
          categoryId: body.categoryId,
        },
        include: {
          category: true
        }
      });

      console.log('Created content in database:', content);

      return NextResponse.json({ 
        success: true, 
        message: 'Content saved successfully to database',
        content 
      });
    } catch (dbError) {
      console.log('Database save failed, using memory storage:', dbError);
      
      // Fallback to memory storage
      const storage = MemoryStorage.getInstance();
      const content = storage.addContent({
        title: body.title,
        description: body.description,
        posterUrl: body.posterUrl || 'https://via.placeholder.com/300x450',
        year: parseInt(body.year) || new Date().getFullYear(),
        duration: body.duration || '120 min',
        rating: parseFloat(body.rating) || 8.0,
        quality: body.quality || 'HD',
        telegramUrl: body.telegramUrl || '#',
        contentType: body.contentType,
        categoryId: body.categoryId,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Content saved successfully to memory storage',
        content 
      });
    }

  } catch (error) {
    console.error('Admin content save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save content' 
    }, { status: 500 });
  }
}