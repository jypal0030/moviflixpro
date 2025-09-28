import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const movies = await db.content.findMany({
      where: {
        contentType: 'MOVIE'
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

    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}