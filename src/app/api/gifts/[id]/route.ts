import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import type { GiftData } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Check if it's a short ID or a base64 ID
    if (id.length > 20) {
       // This would be handled by the client side fallback usually, 
       // but we'll return a 404 here to let the client handle it.
       return NextResponse.json({ error: 'Not a short ID' }, { status: 404 });
    }

    // Try finding the blob that matches our gift shortId
    const { blobs } = await list({ prefix: `gifts/${id}.json` });
    
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    // Get the first match
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
