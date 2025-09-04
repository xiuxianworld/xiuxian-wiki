import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const items = await db.getAll('spiritualRoots');
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching spiritual roots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.type || !data.grade || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await db.create('spiritualRoots', {
      name: data.name,
      type: data.type,
      grade: data.grade,
      description: data.description,
      properties: data.properties || '',
      rarity: data.rarity || 1,
      imageUrl: data.imageUrl || null,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating spiritual root:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}