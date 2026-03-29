'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Drink } from '@/lib/store';

interface DrinkCardProps {
  drink: Drink;
  selected?: boolean;
  onSelect?: (drink: Drink) => void;
  compact?: boolean;
}

export default function DrinkCard({ drink, selected, onSelect, compact }: DrinkCardProps) {
  return (
    <motion.button
      id={`drink-card-${drink.id}`}
      onClick={() => onSelect?.(drink)}
      className={`
        relative group flex flex-col items-center text-center transition-all duration-300
        ${compact ? 'p-1 sm:p-2' : 'p-2 sm:p-3'}
        ${selected ? 'scale-[1.03] sm:scale-105' : ''}
      `}
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      layout
    >
      {/* Selection ring */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-espresso/20 sm:border-espresso/30"
          style={{
            background: `radial-gradient(circle, ${drink.glowColor}, transparent 75%)`,
          }}
          layoutId={`glow-${drink.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1.05 }}
        />
      )}

      {/* Watercolor drink image - Digibouquet style */}
      <div className={`relative z-10 ${compact ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'}`}>
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          className="object-contain drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-lg"
          sizes={compact ? '64px' : '(max-width: 640px) 96px, 128px'}
        />
      </div>

      {/* Name label - appears on hover or when selected, Digibouquet tooltip style */}
      <motion.div
        className={`
          relative z-10 mt-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-sm bg-white/90 border border-cream-dark/30 shadow-sm
          ${compact ? 'hidden' : ''}
        `}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: selected ? 1 : 0.7, y: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <span className="font-serif text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-semibold text-espresso uppercase tracking-wide whitespace-nowrap">
          {drink.name}
        </span>
        {!compact && selected && (
          <p className="hidden xs:block text-[8px] sm:text-[9px] text-espresso-light/50 italic mt-0.5 max-w-[80px] sm:max-w-none truncate sm:whitespace-normal">
            {drink.description}
          </p>
        )}
      </motion.div>

      {/* Selection checkmark */}
      {selected && (
        <motion.div
          className="absolute -top-0.5 -right-0.5 z-20 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-espresso flex items-center justify-center shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <svg width="8" height="6" viewBox="0 0 10 8" fill="none" className="sm:scale-110">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#f5f1ea"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
