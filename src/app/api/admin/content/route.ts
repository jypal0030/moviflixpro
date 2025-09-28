import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const content = await db.content.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      posterUrl,
      year,
      duration,
      rating,
      quality,
      telegramUrl,
      contentType,
      categoryId
    } = body;

    // Validate required fields
    if (!title || !telegramUrl || !contentType) {
      return NextResponse.json(
        { error: 'Title, Telegram URL, and content type are required' },
        { status: 400 }
      );
    }

    const content = await db.content.create({
      data: {
        title,
        description,
        posterUrl,
        year: year ? parseInt(year) : null,
        duration,
        rating: rating ? parseFloat(rating) : null,
        quality,
        telegramUrl,
        contentType,
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}