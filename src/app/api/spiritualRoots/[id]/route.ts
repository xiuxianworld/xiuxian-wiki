import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await db.getById('spiritualRoots', params.id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Spiritual root not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching spiritual root:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const item = await db.update('spiritualRoots', params.id, {
      name: data.name,
      type: data.type,
      grade: data.grade,
      description: data.description,
      properties: data.properties,
      rarity: data.rarity,
      imageUrl: data.imageUrl,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating spiritual root:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete('spiritualRoots', params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting spiritual root:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}