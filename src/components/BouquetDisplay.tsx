'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Drink, GiftData } from '@/lib/store';
import SteamEffect from '@/components/SteamEffect';

interface BouquetDisplayProps {
  drinks: Drink[];
  compact?: boolean;
}

export default function BouquetDisplay({ drinks, compact }: BouquetDisplayProps) {
  const s = compact ? 0.75 : 1;

  // Configuration for Paper Bouquet (cone) style
  const config = {
    wrapper: '/drinks/bouquet-wrapper.png',
    wrapperSize: { w: 260 * s, h: 300 * s },
    containerClass: 'items-end pb-20',
    drinkSize: (count: number) => {
      if (count <= 1) return 120 * s;
      if (count <= 3) return 100 * s; 
      if (count <= 5) return 85 * s;
      return 70 * s;
    },
    getDrinkStyle: (i: number, count: number) => {
      // Clean, side-by-side arrangement centered in the bouquet
      const maxSpread = 200 * s;
      const spread = Math.min(maxSpread, count * 55 * s);
      const x = count > 1 ? (i - (count - 1) / 2) * (spread / (count - 1)) : 0;
      
      // Positioned right at the mouth of the bouquet wrapper
      const yBase = -180 * s; 
      
      // Very slight arc so they don't look completely rigid
      const distFromCenter = Math.abs(i - (count - 1) / 2);
      const arcDrop = distFromCenter * 8 * s;
      
      const y = yBase + arcDrop;
      
      return {
        x,
        y,
        rotate: (i - (count - 1) / 2) * 5,
        zIndex: 20 + i, 
        scale: 1,
      };
    },
  };

  return (
    <div className="flex justify-center items-center overflow-visible w-full">
      <div 
        className={`relative flex justify-center scale-[0.95] sm:scale-110 transition-transform duration-500 ${config.containerClass}`}
        style={{
          width: config.wrapperSize.w,
          minHeight: 400 * s,
        }}
      >
        {/* Layer 0: Wrapper Background (The paper cone) */}
        <motion.div
          className="absolute bottom-0 z-0"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            width: config.wrapperSize.w,
            height: config.wrapperSize.h,
          }}
        >
          <Image
            src={config.wrapper}
            alt="Bouquet Wrapper"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>

        {/* Layer 1: Back Greenery Backdrop */}
        <motion.div
          className="absolute z-[5] pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.9, scale: 1.1 }}
          transition={{ delay: 0.2 }}
          style={{
            width: 300 * s,
            height: 300 * s,
            bottom: 120 * s,
          }}
        >
          <Image
            src="/drinks/greenery.png"
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>

        {/* Layer 2: Drinks */}
        <div className="relative z-[20] w-0 h-0 flex items-center justify-center">
          {drinks.map((drink, i) => {
            const drinkW = config.drinkSize(drinks.length);
            const pos = config.getDrinkStyle(i, drinks.length);

            return (
              <motion.div
                key={`${drink.id}-${i}`}
                className="absolute"
                style={{ width: drinkW, height: drinkW, zIndex: pos.zIndex }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 20, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: pos.scale, 
                  x: pos.x, 
                  y: pos.y, 
                  rotate: pos.rotate 
                }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <motion.div
                  className="relative w-full h-full"
                  animate={{ y: [0, -4 * s, 0] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                >
                  <Image src={drink.image} alt={drink.name} fill className="object-contain drop-shadow-2xl" sizes={`${Math.round(drinkW)}px`} />
                  {(drink.category === 'coffee' || drink.category === 'matcha') && <SteamEffect color={drink.color} />}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
