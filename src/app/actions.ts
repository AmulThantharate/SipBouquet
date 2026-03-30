'use server';

import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import type { GiftData } from '@/lib/store';

export async function createGiftAction(giftData: GiftData) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is missing');
    }

    const shortId = nanoid(8);
    const fileName = `gifts/${shortId}.json`;

    await put(fileName, JSON.stringify(giftData), {
      access: 'public',
      addRandomSuffix: false,
    });

    return { success: true, id: shortId };
  } catch (error) {
    console.error('Server Action Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
