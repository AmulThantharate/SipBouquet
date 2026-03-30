'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BouquetDisplay from '@/components/BouquetDisplay';
import { getGift, THEMES } from '@/lib/store';
import type { GiftData } from '@/lib/store';

export default function GiftPage() {
  const params = useParams<{ id: string }>();
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadGift() {
      if (params.id) {
        const idString = params.id as string;
        
        // Try local base64 decoding first (backward compatibility)
        const localGift = getGift(idString);
        if (localGift && idString.length > 20) {
          setGift(localGift);
          setLoading(false);
          return;
        }

        // If not base64 or not found, try fetching from KV API
        try {
          const res = await fetch(`/api/gifts/${idString}`);
          if (res.ok) {
            const data = await res.json();
            setGift(data);
          }
        } catch (error) {
          console.error('Failed to fetch gift:', error);
        }
      }
      setLoading(false);
    }

    loadGift();
  }, [params.id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          ☕
        </motion.div>
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <span className="text-6xl block">🫖</span>
          <h1 className="font-serif text-2xl text-espresso">Gift not found</h1>
          <p className="text-espresso-light/60 text-sm max-w-sm">
            This gift link may have expired or the bouquet hasn&apos;t been brewed yet.
          </p>
          <Link
            href="/"
            className="inline-block bg-espresso text-cream px-6 py-3 rounded-full text-sm font-medium mt-4"
          >
            Brew a New One
          </Link>
        </motion.div>
      </div>
    );
  }

  const theme = THEMES[gift.theme];

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] sm:top-[20%] left-[5%] sm:left-[15%] w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme.accent }}
        />
        <div
          className="absolute bottom-[10%] sm:bottom-[20%] right-[5%] sm:right-[15%] w-64 sm:w-80 h-64 sm:h-80 rounded-full blur-3xl opacity-8"
          style={{ backgroundColor: theme.accent }}
        />
      </div>

      {/* Content - Digibouquet share page style */}
      <motion.div
        className="relative z-10 w-full max-w-md flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Brand */}
        <motion.p
          className="font-serif text-base sm:text-lg italic text-espresso/60 mb-3 sm:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          SipBouquet
        </motion.p>

        {/* Greeting */}
        <motion.h1
          className="font-serif text-lg sm:text-xl md:text-2xl text-espresso text-center mb-4 sm:mb-6 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Hi, I made this bouquet for you!
        </motion.h1>

        {/* Bouquet Display - the main visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full flex justify-center py-4"
        >
          <BouquetDisplay
            drinks={gift.drinks}
          />
        </motion.div>

        {/* Message card - like Digibouquet note card */}
        <motion.div
          className="w-full bg-white/80 backdrop-blur-sm border border-cream-dark/20 rounded-lg px-5 sm:px-6 py-4 sm:py-5 mt-4 shadow-sm mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] sm:text-xs text-espresso-light/40 uppercase tracking-wider mb-2">
            Dear {gift.recipientName},
          </p>
          <p className="font-serif text-espresso/80 text-sm sm:text-base leading-relaxed italic">
            {gift.message}
          </p>
          <div className="mt-4 pt-3 border-t border-cream-dark/15 flex justify-between items-center gap-2">
            <p className="text-[10px] sm:text-xs text-espresso-light/50 truncate">
              Sincerely, <span className="font-semibold text-espresso-light/70">{gift.senderName}</span>
            </p>
            <p className="text-[8px] sm:text-[9px] text-espresso-light/30 shrink-0">
              {new Date(gift.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </motion.div>

        {/* Actions - Digibouquet style buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            id="share-gift"
            onClick={handleShare}
            className="w-full sm:w-auto bg-espresso text-cream px-8 py-3 text-xs font-medium uppercase tracking-wider hover:bg-espresso-light transition-all shadow-md active:scale-95"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </motion.button>

          <motion.button
            onClick={handleShare}
            className="w-full sm:w-auto border border-espresso/30 text-espresso px-8 py-3 text-xs font-medium uppercase tracking-wider hover:bg-espresso/5 transition-all active:scale-95"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Share
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-10 sm:mt-12 space-y-2 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-[9px] sm:text-[10px] text-espresso-light/25 uppercase tracking-[0.15em]">
            made with sipbouquet
          </p>
          <Link
            href="/"
            className="text-[9px] sm:text-[10px] text-espresso-light/40 underline underline-offset-2 hover:text-espresso-light/60 transition-colors"
          >
            make a bouquet now!
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
