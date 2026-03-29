'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] aspect-square rounded-full bg-matcha-light/8 blur-3xl pointer-events-none" />

      {/* Main content - clean Digibouquet style */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hero bouquet illustration */}
        <motion.div
          className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 mb-6 sm:mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <Image
            src="/drinks/hero-bouquet.png"
            alt="SipBouquet"
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 256px"
            priority
          />
        </motion.div>

        {/* Title - Digibouquet script style */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-espresso mb-3 sm:mb-4 italic"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          SipBouquet
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-espresso-light/60 text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-8 sm:mb-10 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Beautiful sips, delivered digitally
        </motion.p>

        {/* CTA - clean Digibouquet button */}
        <motion.div
          className="flex flex-col items-center gap-4 w-full px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/build" id="cta-start" className="w-full sm:w-auto">
            <motion.div
              className="bg-espresso text-cream px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-medium uppercase tracking-[0.15em] cursor-pointer hover:bg-espresso-light transition-all shadow-md active:scale-95"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Build a Bouquet
            </motion.div>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 sm:mt-16 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-[9px] sm:text-[10px] text-espresso-light/50 uppercase tracking-[0.15em]">
            made with ☕ + 🍵
          </p>
          <p className="text-[9px] sm:text-[10px] text-espresso-light/70 uppercase tracking-[0.2em] font-medium">
            by Amul Thantharate
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
