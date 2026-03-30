import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.error('SERVER ERROR: BLOB_READ_WRITE_TOKEN missing in GET route.');
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }
    
    // Check if it's a short ID
    if (id.length > 20) {
       return NextResponse.json({ error: 'Not a short ID' }, { status: 404 });
    }

    // List the blobs matching the prefix with the token
    const { blobs } = await list({ 
      prefix: `gifts/${id}.json`,
      token: token
    });
    
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    // Get the first match
    const giftUrl = blobs[0].url;

    // Fetch the private blob using the token
    const response = await fetch(giftUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' // Ensure we get fresh data
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch blob contents. Status: ${response.status}`);
      return NextResponse.json({ error: 'Failed to read gift' }, { status: 500 });
    }

    const gift = await response.json();
    return NextResponse.json(gift);
  } catch (error) {
    console.error('Fetch gift error detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift' },
      { status: 500 }
    );
  }
}
