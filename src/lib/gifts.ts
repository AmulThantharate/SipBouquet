import { put, list } from '@vercel/blob';
import { nanoid } from 'nanoid';
import type { GiftData } from './store';

// We'll store the JSON in Blob and use the filename as our short ID
export async function saveGiftToBlob(gift: GiftData): Promise<string> {
  const shortId = nanoid(10);
  const fileName = `gifts/${shortId}.json`;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  await put(fileName, JSON.stringify(gift), {
    access: 'private', // Match private store configuration
    addRandomSuffix: true,
    token: token
  });
  
  return shortId;
}

export async function getGiftFromBlob(shortId: string): Promise<GiftData | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const { blobs } = await list({ 
      prefix: `gifts/${shortId}.json`,
      token: token
    });
    
    if (blobs.length === 0) return null;
    
    const response = await fetch(blobs[0].url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
