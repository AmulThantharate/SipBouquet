'use server';

import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import type { GiftData } from '@/lib/store';

export async function createGiftAction(giftData: GiftData) {
  try {
    // Check for token explicitly
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('DATABASE ERROR: BLOB_READ_WRITE_TOKEN is missing in environment variables.');
      return { success: false, error: 'Storage token missing. Please check Vercel environment variables.' };
    }

    const shortId = nanoid(10); // Slightly longer for better uniqueness
    const fileName = `gifts/${shortId}.json`;

    console.log(`Attempting to upload gift ${shortId} to Vercel Blob...`);

    const blob = await put(fileName, JSON.stringify(giftData), {
      access: 'public',
      addRandomSuffix: true, // Let Vercel handle the suffix to prevent collisions
      token: token, // Pass token explicitly just in case
    });

    console.log('Upload successful:', blob.url);

    return { success: true, id: shortId };
  } catch (error) {
    console.error('CRITICAL SERVER ERROR:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown server error occurred' 
    };
  }
}
