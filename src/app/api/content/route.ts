\import { NextRequest, NextResponse } from 'next/server';

// Mock content data
let mockContent = [
  {
    id: "1",
    title: "Sample Movie",
    description: "This is a sample movie for testing",
    posterUrl: "https://via.placeholder.com/300x450",
    year: 2024,
    duration: "2h 30m",
    rating: 8.5,
    quality: "HD",
    telegramUrl: "https://t.me/sample",
    contentType: "MOVIE",
    categoryId: "1",
    createdAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type');
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredContent = mockContent;
    
    if (contentType) {
      filteredContent = filteredContent.filter(item => item.contentType === contentType);
    }
    
    if (categoryId) {
      filteredContent = filteredContent.filter(item => item.categoryId === categoryId);
    }
    
    if (search) {
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Add category info
    const contentWithCategory = filteredContent.map(item => ({
      ...item,
      category: {
        id: item.categoryId,
        name: getCategoryName(item.categoryId),
        slug: getCategorySlug(item.categoryId)
      }
    }));

    return NextResponse.json(contentWithCategory);
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
    console.log('POST request body:', body);
    
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

    console.log('Creating content with data:', {
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
    });

    const newContent = {
      id: Date.now().toString(),
      title,
      description: description || '',
      posterUrl: posterUrl || '',
      year: year ? parseInt(year) : undefined,
      duration: duration || '',
      rating: rating ? parseFloat(rating) : undefined,
      quality: quality || '',
      telegramUrl: telegramUrl || '',
      contentType,
      categoryId: categoryId || '',
      createdAt: new Date().toISOString()
    };

    mockContent.push(newContent);

    console.log('Content created successfully:', newContent);
    
    // Add category info for response
    const contentWithCategory = {
      ...newContent,
      category: categoryId ? {
        id: categoryId,
        name: getCategoryName(categoryId),
        slug: getCategorySlug(categoryId)
      } : null
    };
    
    return NextResponse.json(contentWithCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content', details: error.message },
      { status: 500 }
    );
  }
}

// Helper functions
function getCategoryName(categoryId: string): string {
  const categories = {
    "1": "Action",
    "2": "Comedy", 
    "3": "Drama",
    "4": "Horror",
    "5": "Romance",
    "6": "Thriller",
    "7": "Action Series",
    "8": "Comedy Series",
    "9": "Drama Series",
    "10": "Documentary Series"
  };
  return categories[categoryId as keyof typeof categories] || "Unknown";
}

function getCategorySlug(categoryId: string): string {
  const slugs = {
    "1": "action",
    "2": "comedy",
    "3": "drama", 
    "4": "horror",
    "5": "romance",
    "6": "thriller",
    "7": "action-series",
    "8": "comedy-series",
    "9": "drama-series",
    "10": "documentary-series"
  };
  return slugs[categoryId as keyof typeof slugs] || "unknown";
}