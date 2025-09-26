import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = await db.content.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const content = await db.content.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(year !== undefined && { year: year ? parseInt(year) : null }),
        ...(duration !== undefined && { duration }),
        ...(rating !== undefined && { rating: rating ? parseFloat(rating) : null }),
        ...(quality !== undefined && { quality }),
        ...(telegramUrl !== undefined && { telegramUrl }),
        ...(contentType && { contentType }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.content.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}