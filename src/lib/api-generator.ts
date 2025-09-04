import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { requireAuth } from '@/lib/auth';
import { CategoryType } from '@/types';

export function createCategoryRoute(category: CategoryType, requiredFields: string[]) {
  return {
    async GET() {
      try {
        const items = await db.getAll(category);
        return NextResponse.json(items);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    },

    async POST(request: NextRequest) {
      try {
        // Require authentication for creating items
        await requireAuth(request);
        
        const data = await request.json();
        
        // Validate required fields
        for (const field of requiredFields) {
          if (!data[field]) {
            return NextResponse.json(
              { error: `Missing required field: ${field}` },
              { status: 400 }
            );
          }
        }

        const item = await db.create(category, data);
        return NextResponse.json(item, { status: 201 });
      } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        console.error(`Error creating ${category}:`, error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    }
  };
}

export function createItemRoute(category: CategoryType) {
  return {
    async GET(
      request: NextRequest,
      { params }: { params: { id: string } }
    ) {
      try {
        const item = await db.getById(category, params.id);
        
        if (!item) {
          return NextResponse.json(
            { error: `${category} not found` },
            { status: 404 }
          );
        }

        return NextResponse.json(item);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    },

    async PUT(
      request: NextRequest,
      { params }: { params: { id: string } }
    ) {
      try {
        // Require authentication for updating items
        await requireAuth(request);
        
        const data = await request.json();
        const item = await db.update(category, params.id, data);
        return NextResponse.json(item);
      } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        console.error(`Error updating ${category}:`, error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    },

    async DELETE(
      request: NextRequest,
      { params }: { params: { id: string } }
    ) {
      try {
        // Require authentication for deleting items
        await requireAuth(request);
        
        await db.delete(category, params.id);
        return NextResponse.json({ success: true });
      } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        console.error(`Error deleting ${category}:`, error);
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    }
  };
}