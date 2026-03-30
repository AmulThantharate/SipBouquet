import { put, head, del } from '@vercel/blob';
import { nanoid } from 'nanoid';
import type { GiftData } from './store';

// We'll store the JSON in Blob and use the filename as our short ID
export async function saveGiftToBlob(gift: GiftData): Promise<string> {
  const shortId = nanoid(8);
  const fileName = `gifts/${shortId}.json`;
  
  console.log(`Uploading to blob: ${fileName}`);
  
  const blob = await put(fileName, JSON.stringify(gift), {
    access: 'public',
    addRandomSuffix: false, // This ensures our clean ID is kept
  });
  
  console.log('Blob upload result URL:', blob.url);
  return shortId;
}

export async function getGiftFromBlob(shortId: string): Promise<GiftData | null> {
  try {
    // To fetch, we need to find the blob's actual URL. 
    // Since we're using Vercel Blob, we'll store a simple KV mapping for the URL or
    // just use the list/head if we know the path.
    // For simplicity in this demo, we'll fetch via the public URL if we know it, 
    // or just fetch it through a server-side helper.
    
    // In a real Vercel environment, you'd usually use the list() function to find it
    // but here we'll assume the URL structure provided by Vercel.
    return null; // I'll refine the API route to handle this better
  } catch {
    return null;
  }
}
