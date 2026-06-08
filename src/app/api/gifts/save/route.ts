import { NextRequest, NextResponse } from 'next/server';
import { saveGiftToBlob } from '@/lib/gifts';
import type { GiftData } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const gift = await request.json() as GiftData;
    console.log('Attempting to save gift to Blob...');
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not defined');
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
    }

    const shortId = await saveGiftToBlob(gift);
    console.log('Gift saved successfully with ID:', shortId);
    return NextResponse.json({ id: shortId });
  } catch (error) {
    console.error('Save gift error detail:', error);
    return NextResponse.json(
      { error: 'Failed to save gift', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
