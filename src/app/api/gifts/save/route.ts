import { NextRequest, NextResponse } from 'next/server';
import { saveGiftToBlob } from '@/lib/gifts';
import type { GiftData } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const gift = await request.json() as GiftData;
    const shortId = await saveGiftToBlob(gift);
    return NextResponse.json({ id: shortId });
  } catch (error) {
    console.error('Save gift error:', error);
    return NextResponse.json(
      { error: 'Failed to save gift' },
      { status: 500 }
    );
  }
}
