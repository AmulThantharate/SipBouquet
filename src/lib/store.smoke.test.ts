import { beforeEach, describe, expect, it } from 'vitest';
import {
  DRINKS,
  decodeGift,
  encodeGift,
  getDraftDrinks,
  getDraftMessage,
  getDraftNames,
  getDraftTheme,
  getGift,
  saveDraftDrinks,
  saveDraftMessage,
  saveDraftNames,
  saveDraftTheme,
  saveGift,
} from './store';
import type { GiftData } from './store';

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const localStorageMock = new LocalStorageMock();

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {},
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  });
});

describe('store smoke flow', () => {
  it('encodes a gift into a shareable id and decodes it back', async () => {
    const gift: GiftData = {
      id: '',
      drinks: DRINKS.slice(0, 3),
      message: 'A warm cup for a good day.',
      senderName: 'Ava',
      recipientName: 'Sam',
      theme: 'botanical',
      bouquetStyle: 'cone',
      createdAt: '2026-06-08T00:00:00.000Z',
    };

    const id = await encodeGift(gift);
    const decoded = await decodeGift(id);

    expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decoded).toMatchObject({
      id,
      message: gift.message,
      senderName: gift.senderName,
      recipientName: gift.recipientName,
      theme: gift.theme,
      bouquetStyle: 'cone',
      createdAt: gift.createdAt,
    });
    expect(decoded?.drinks.map((drink) => drink.id)).toEqual(
      gift.drinks.map((drink) => drink.id)
    );
  });

  it('saves draft and gift data in localStorage', async () => {
    const drinks = DRINKS.slice(1, 4);
    const gift: GiftData = {
      id: 'gift-1',
      drinks,
      message: 'Enjoy these sips.',
      senderName: 'Mira',
      recipientName: 'Noah',
      theme: 'warm',
      bouquetStyle: 'cone',
      createdAt: '2026-06-08T00:00:00.000Z',
    };

    saveDraftDrinks(drinks);
    saveDraftTheme('cool');
    saveDraftMessage(gift.message);
    saveDraftNames(gift.senderName, gift.recipientName);
    saveGift(gift);

    expect(getDraftDrinks().map((drink) => drink.id)).toEqual(
      drinks.map((drink) => drink.id)
    );
    expect(getDraftTheme()).toBe('cool');
    expect(getDraftMessage()).toBe(gift.message);
    expect(getDraftNames()).toEqual({
      sender: gift.senderName,
      recipient: gift.recipientName,
    });
    expect(await getGift(gift.id)).toEqual(gift);
  });
});
