'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import DrinkCard from '@/components/DrinkCard';
import { DRINKS, saveDraftDrinks, getDraftDrinks } from '@/lib/store';
import type { Drink } from '@/lib/store';

export default function BuildPage() {
  const router = useRouter();
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);
  const [filter, setFilter] = useState<'all' | 'coffee' | 'matcha' | 'specialty'>('all');

  useEffect(() => {
    const saved = getDraftDrinks();
    if (saved.length > 0) setSelectedDrinks(saved);
  }, []);

  const handleSelect = (drink: Drink) => {
    setSelectedDrinks((prev) => {
      const exists = prev.find((d) => d.id === drink.id);
      if (!exists && prev.length >= 9) return prev;
      const updated = exists ? prev.filter((d) => d.id !== drink.id) : [...prev, drink];
      saveDraftDrinks(updated);
      return updated;
    });
  };

  const filtered = filter === 'all' ? DRINKS : DRINKS.filter((d) => d.category === filter);

  const handleNext = () => {
    if (selectedDrinks.length < 3) return;
    saveDraftDrinks(selectedDrinks);
    router.push('/arrange');
  };

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8 pb-20">
        {/* Header - Digibouquet style */}
        <div className="text-center px-4">
          <motion.h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso mb-2 sm:mb-3 italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SipBouquet
          </motion.h1>
          <motion.p
            className={`text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium transition-colors duration-300 ${
              selectedDrinks.length < 3 ? 'text-espresso-light/70' : 
              selectedDrinks.length === 9 ? 'text-amber-600' : 'text-espresso-light/70'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {selectedDrinks.length < 3 
              ? `Select ${3 - selectedDrinks.length} more to continue` 
              : selectedDrinks.length === 9 
                ? 'Limit reached (9/9)' 
                : `${selectedDrinks.length}/9 sips selected`}
          </motion.p>
        </div>

        {/* Filter tabs - Scrollable on mobile */}
        <motion.div
          className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-4 sm:pb-0 px-4 no-scrollbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {(['all', 'coffee', 'matcha', 'specialty'] as const).map((cat) => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={`
                px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium capitalize transition-all duration-300 whitespace-nowrap
                ${
                  filter === cat
                    ? 'bg-espresso text-cream shadow-md'
                    : 'bg-white/50 text-espresso-light/60 hover:bg-white/80 hover:text-espresso'
                }
              `}
            >
              {cat === 'all' ? '✨ All' : cat === 'coffee' ? '☕ Coffee' : cat === 'matcha' ? '🍵 Matcha' : '🫖 Specialty'}
            </button>
          ))}
        </motion.div>

        {/* Drink grid - Standard Grid for reliability */}
        <div className="px-4 max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6 justify-items-center"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((drink, i) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                  className="w-full flex justify-center"
                >
                  <DrinkCard
                    drink={drink}
                    selected={!!selectedDrinks.find((d) => d.id === drink.id)}
                    onSelect={handleSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Selection summary & next */}
        <AnimatePresence>
          {selectedDrinks.length > 0 && (
            <motion.div
              className="fixed bottom-4 left-0 right-0 z-40 px-4 sm:px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-cream-dark/30 shadow-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                  <div className="flex -space-x-2 shrink-0">
                    {selectedDrinks.slice(0, 3).map((d) => (
                      <span
                        key={d.id}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cream flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
                      >
                        <Image src={d.image} alt={d.name} width={24} height={24} className="object-contain" />
                      </span>
                    ))}
                    {selectedDrinks.length > 3 && (
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-espresso flex items-center justify-center text-[9px] sm:text-[10px] text-cream font-medium border-2 border-white shadow-sm">
                        +{selectedDrinks.length - 3}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-sm text-espresso-light/70 truncate">
                    {selectedDrinks.length} drink{selectedDrinks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <motion.button
                  id="next-arrange"
                  onClick={handleNext}
                  disabled={selectedDrinks.length < 3}
                  className={`
                    px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-medium transition-all duration-300 shrink-0
                    ${selectedDrinks.length < 3 
                      ? 'bg-espresso/20 text-espresso/40 cursor-not-allowed' 
                      : 'bg-espresso text-cream hover:shadow-lg hover:scale-105 active:scale-95'}
                  `}
                >
                  Arrange →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
