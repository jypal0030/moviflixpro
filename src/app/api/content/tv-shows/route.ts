import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tvShows = await db.content.findMany({
      where: {
        contentType: 'WEB_SERIES'
      },
      include: {
        category: true
      },
      orderBy: [
        { rating: 'desc' },
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(tvShows);
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV shows' },
      { status: 500 }
    );
  }
}