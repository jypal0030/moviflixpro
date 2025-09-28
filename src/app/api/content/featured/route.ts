import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get featured content (latest content or content with high rating)
    const featuredContent = await db.content.findMany({
      where: {
        OR: [
          { rating: { gte: 8.0 } },
          { year: { gte: 2023 } }
        ]
      },
      include: {
        category: true
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 10 // Limit to 10 featured items
    });

    return NextResponse.json(featuredContent);
  } catch (error) {
    console.error('Error fetching featured content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured content' },
      { status: 500 }
    );
  }
}