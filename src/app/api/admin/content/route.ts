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

    // Create content object
    const content = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      posterUrl: body.posterUrl || 'https://via.placeholder.com/300x450',
      year: body.year || new Date().getFullYear(),
      duration: body.duration || '120 min',
      rating: body.rating || '8.0',
      quality: body.quality || 'HD',
      telegramUrl: body.telegramUrl || '#',
      contentType: body.contentType,
      categoryId: body.categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Created content:', content);

    // For now, we'll just return success
    // In a real app, you'd save to database
    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully',
      content 
    });

  } catch (error) {
    console.error('Admin content save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save content' 
    }, { status: 500 });
  }
}