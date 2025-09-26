import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type');
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    let where: any = {};
    
    if (contentType) {
      where.contentType = contentType;
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const contents = await db.content.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      categoryId,
    } = body;

    if (!title || !contentType) {
      return NextResponse.json(
        { error: 'Title and content type are required' },
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
        categoryId,
      },
      include: {
        category: true,
      },
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