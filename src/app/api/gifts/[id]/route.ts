import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params promise
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (id.length > 20) {
       return NextResponse.json({ error: 'Not a short ID' }, { status: 404 });
    }

    const { blobs } = await list({ prefix: `gifts/${id}.json` });
    
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    const giftUrl = blobs[0].url;
    const response = await fetch(giftUrl);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to load gift data' }, { status: 500 });
    }

    const gift = await response.json();
    return NextResponse.json(gift);
  } catch (error) {
    console.error('Fetch gift error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift' },
      { status: 500 }
    );
  }
}
