'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import BouquetDisplay from '@/components/BouquetDisplay';
import {
  getDraftDrinks,
  getDraftTheme,
  saveDraftTheme,
  THEMES,
} from '@/lib/store';
import type { Drink, GiftData } from '@/lib/store';

export default function ArrangePage() {
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [theme, setTheme] = useState<GiftData['theme']>('warm');

  useEffect(() => {
    const saved = getDraftDrinks();
    if (saved.length === 0) {
      router.push('/build');
      return;
    }
    setDrinks(saved);
    setTheme(getDraftTheme());
  }, [router]);

  const handleThemeChange = (t: GiftData['theme']) => {
    setTheme(t);
    saveDraftTheme(t);
  };

  const currentTheme = THEMES[theme];

  if (drinks.length === 0) return null;

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <motion.h1
            className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Arrange Your Bouquet
          </motion.h1>
          <motion.p
            className="text-espresso-light/60 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose a color theme for your gift
          </motion.p>
        </div>

        {/* Theme selector - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4 sm:px-0"
        >
          <p className="text-[10px] sm:text-xs font-medium text-espresso-light/50 uppercase tracking-wider mb-3">
            Color Theme
          </p>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((key) => (
              <button
                key={key}
                id={`theme-${key}`}
                onClick={() => handleThemeChange(key)}
                className={`
                  flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all duration-300 border-2 whitespace-nowrap
                  ${
                    theme === key
                      ? 'border-espresso bg-white shadow-md'
                      : 'border-transparent bg-white/40 hover:bg-white/70'
                  }
                `}
              >
                <div
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full"
                  style={{ backgroundColor: THEMES[key].accent }}
                />
                <span>{THEMES[key].name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Preview area */}
        <motion.div
          className={`rounded-[2.5rem] p-6 sm:p-8 md:p-12 bg-gradient-to-br ${currentTheme.gradient} border border-white/50 shadow-inner min-h-[400px] sm:min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden`}
          layout
          transition={{ duration: 0.5 }}
        >
          {/* Background bokeh effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {drinks.map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  width: 60 + i * 30,
                  height: 60 + i * 30,
                  backgroundColor: currentTheme.accent,
                  left: `${20 + (i * 20) % 80}%`,
                  top: `${30 + (i % 2) * 30}%`,
                  filter: 'blur(30px)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Gift title preview */}
          <motion.div
            className="text-center mb-4 sm:mb-2 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-espresso-light/40 text-[9px] sm:text-xs uppercase tracking-[0.2em] mb-1">
              a bouquet for you
            </p>
            <h2 className="font-serif text-lg sm:text-xl text-espresso/80 italic">Your SipBouquet</h2>
          </motion.div>

          {/* Bouquet Display */}
          <div className="relative z-10 w-full flex justify-center">
            <BouquetDisplay
              drinks={drinks}
            />
          </div>
        </motion.div>

        {/* Next step */}
        <motion.div
          className="flex justify-end px-4 sm:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            id="next-message"
            onClick={() => router.push('/message')}
            className="w-full sm:w-auto bg-espresso text-cream px-8 py-3.5 sm:py-3 rounded-full text-sm font-medium hover:shadow-lg transition-all active:scale-95 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add a Message →
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
