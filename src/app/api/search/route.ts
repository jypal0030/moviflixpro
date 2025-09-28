import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const contentType = searchParams.get('type');

    if (!query || query.trim() === '') {
      return NextResponse.json([]);
    }

    const whereClause: any = {
      title: {
        contains: query
      }
    };

    // Add content type filter
    if (contentType && contentType !== 'all') {
      whereClause.contentType = contentType;
    }

    const content = await db.content.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: [
        { rating: 'desc' },
        { year: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 50 // Limit results
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error searching content:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}