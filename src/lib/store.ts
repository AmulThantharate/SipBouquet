export interface Drink {
  id: string;
  name: string;
  emoji: string;
  image: string;
  color: string;
  glowColor: string;
  description: string;
  category: 'coffee' | 'matcha' | 'specialty';
}

export interface GiftData {
  id: string;
  drinks: Drink[];
  message: string;
  senderName: string;
  recipientName: string;
  theme: 'warm' | 'cool' | 'botanical';
  bouquetStyle: 'cone';
  createdAt: string;
}

export const DRINKS: Drink[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    emoji: '☕',
    image: '/drinks/espresso.png',
    color: '#4a3c2a',
    glowColor: 'rgba(74, 60, 42, 0.4)',
    description: 'Bold & intense',
    category: 'coffee',
  },
  {
    id: 'latte',
    name: 'Oat Latte',
    emoji: '🥛',
    image: '/drinks/latte.png',
    color: '#c8a882',
    glowColor: 'rgba(200, 168, 130, 0.4)',
    description: 'Creamy & smooth',
    category: 'coffee',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    emoji: '☕',
    image: '/drinks/cappuccino.png',
    color: '#8B6914',
    glowColor: 'rgba(139, 105, 20, 0.4)',
    description: 'Frothy & classic',
    category: 'coffee',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    emoji: '🍵',
    image: '/drinks/matcha-latte.png',
    color: '#7fb069',
    glowColor: 'rgba(127, 176, 105, 0.4)',
    description: 'Earthy & calming',
    category: 'matcha',
  },
  {
    id: 'iced-matcha',
    name: 'Iced Matcha',
    emoji: '🧊',
    image: '/drinks/iced-matcha.png',
    color: '#5a8a45',
    glowColor: 'rgba(90, 138, 69, 0.4)',
    description: 'Cool & refreshing',
    category: 'matcha',
  },
  {
    id: 'hojicha',
    name: 'Hojicha Latte',
    emoji: '🫖',
    image: '/drinks/hojicha.png',
    color: '#a0522d',
    glowColor: 'rgba(160, 82, 45, 0.4)',
    description: 'Toasty & warm',
    category: 'specialty',
  },
  {
    id: 'chai',
    name: 'Chai Latte',
    emoji: '🫖',
    image: '/drinks/chai.png',
    color: '#d4a574',
    glowColor: 'rgba(212, 165, 116, 0.4)',
    description: 'Spiced & cozy',
    category: 'specialty',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    emoji: '🧋',
    image: '/drinks/cold-brew.png',
    color: '#3c2415',
    glowColor: 'rgba(60, 36, 21, 0.4)',
    description: 'Smooth & strong',
    category: 'coffee',
  },
  {
    id: 'affogato',
    name: 'Affogato',
    emoji: '🍨',
    image: '/drinks/affogato.png',
    color: '#6b4c3b',
    glowColor: 'rgba(107, 76, 59, 0.4)',
    description: 'Sweet & luxurious',
    category: 'specialty',
  },
  {
    id: 'strawberry-matcha',
    name: 'Strawberry Matcha',
    emoji: '🍓',
    image: '/drinks/strawberry-matcha.png',
    color: '#d4637a',
    glowColor: 'rgba(212, 99, 122, 0.4)',
    description: 'Pink & dreamy',
    category: 'matcha',
  },
];

export const THEMES = {
  warm: {
    name: 'Warm Sunset',
    gradient: 'from-amber-50 via-orange-50 to-rose-50',
    accent: '#c89654',
    bg: '#fef3e2',
  },
  cool: {
    name: 'Misty Morning',
    gradient: 'from-slate-50 via-blue-50 to-indigo-50',
    accent: '#7c9eb2',
    bg: '#f0f4f8',
  },
  botanical: {
    name: 'Botanical Garden',
    gradient: 'from-emerald-50 via-green-50 to-lime-50',
    accent: '#7fb069',
    bg: '#f0f7ec',
  },
} as const;

export const BOUQUET_STYLES = {
  cone: {
    name: 'Paper Bouquet',
    emoji: '💐',
    image: '/drinks/bouquet-wrapper.png',
    description: 'Classic wrapped cone',
  },
} as const;

// localStorage helpers
export function saveGift(gift: GiftData): void {
  if (typeof window === 'undefined') return;
  const gifts = getGifts();
  gifts[gift.id] = gift;
  localStorage.setItem('sipbouquet_gifts', JSON.stringify(gifts));
}

export function getGift(id: string): GiftData | null {
  if (typeof window === 'undefined') return null;
  const gifts = getGifts();
  return gifts[id] || null;
}

export function getGifts(): Record<string, GiftData> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem('sipbouquet_gifts');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveDraftDrinks(drinks: Drink[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sipbouquet_draft_drinks', JSON.stringify(drinks));
}

export function getDraftDrinks(): Drink[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('sipbouquet_draft_drinks');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDraftTheme(theme: GiftData['theme']): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sipbouquet_draft_theme', theme);
}

export function getDraftTheme(): GiftData['theme'] {
  if (typeof window === 'undefined') return 'warm';
  return (localStorage.getItem('sipbouquet_draft_theme') as GiftData['theme']) || 'warm';
}

export function saveDraftMessage(message: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sipbouquet_draft_message', message);
}

export function getDraftMessage(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('sipbouquet_draft_message') || '';
}

export function saveDraftNames(sender: string, recipient: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sipbouquet_draft_sender', sender);
  localStorage.setItem('sipbouquet_draft_recipient', recipient);
}

export function getDraftNames(): { sender: string; recipient: string } {
  if (typeof window === 'undefined') return { sender: '', recipient: '' };
  return {
    sender: localStorage.getItem('sipbouquet_draft_sender') || '',
    recipient: localStorage.getItem('sipbouquet_draft_recipient') || '',
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function saveDraftBouquetStyle(style: GiftData['bouquetStyle']): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sipbouquet_draft_bouquet_style', style);
}

export function getDraftBouquetStyle(): GiftData['bouquetStyle'] {
  if (typeof window === 'undefined') return 'cone';
  return (localStorage.getItem('sipbouquet_draft_bouquet_style') as GiftData['bouquetStyle']) || 'cone';
}
