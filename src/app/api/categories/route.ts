import { NextRequest, NextResponse } from 'next/server';

// Mock categories data
const mockCategories = [
  {
    id: "1",
    name: "Action",
    slug: "action", 
    description: "High-energy movies with lots of stunts and fighting",
    contentType: "MOVIE",
    contentCount: 0
  },
  {
    id: "2", 
    name: "Comedy",
    slug: "comedy",
    description: "Funny movies that make you laugh", 
    contentType: "MOVIE",
    contentCount: 0
  },
  {
    id: "3",
    name: "Drama", 
    slug: "drama",
    description: "Serious movies with emotional stories",
    contentType: "MOVIE", 
    contentCount: 0
  },
  {
    id: "4",
    name: "Horror",
    slug: "horror", 
    description: "Scary movies to give you chills",
    contentType: "MOVIE",
    contentCount: 0
  },
  {
    id: "5",
    name: "Romance",
    slug: "romance",
    description: "Love stories and romantic comedies", 
    contentType: "MOVIE",
    contentCount: 0
  },
  {
    id: "6",
    name: "Thriller",
    slug: "thriller",
    description: "Suspenseful movies that keep you on edge",
    contentType: "MOVIE",
    contentCount: 0
  },
  {
    id: "7",
    name: "Action Series",
    slug: "action-series", 
    description: "High-energy web series with lots of action",
    contentType: "WEB_SERIES",
    contentCount: 0
  },
  {
    id: "8",
    name: "Comedy Series", 
    slug: "comedy-series",
    description: "Funny web series that make you laugh",
    contentType: "WEB_SERIES",
    contentCount: 0
  },
  {
    id: "9",
    name: "Drama Series",
    slug: "drama-series",
    description: "Serious web series with emotional stories", 
    contentType: "WEB_SERIES",
    contentCount: 0
  },
  {
    id: "10",
    name: "Documentary Series",
    slug: "documentary-series",
    description: "Educational and informative web series",
    contentType: "WEB_SERIES", 
    contentCount: 0
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type');
    
    let filteredCategories = mockCategories;
    
    if (contentType) {
      filteredCategories = mockCategories.filter(cat => cat.contentType === contentType);
    }
    
    return NextResponse.json(filteredCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, contentType } = body;
    
    if (!name || !contentType) {
      return NextResponse.json(
        { error: 'Name and content type are required' },
        { status: 400 }
      );
    }
    
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newCategory = {
      id: Date.now().toString(),
      name,
      slug,
      description: description || '',
      contentType,
      contentCount: 0
    };
    
    mockCategories.push(newCategory);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}