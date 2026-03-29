'use client';

import { motion } from 'framer-motion';

export default function SteamEffect({ color = '#c8a882' }: { color?: string }) {
  const steamPaths = [
    { delay: 0, x: 0 },
    { delay: 0.4, x: -6 },
    { delay: 0.8, x: 6 },
  ];

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none w-16 h-12">
      {steamPaths.map((steam, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `calc(50% + ${steam.x}px)`,
            width: 3,
            height: 20,
            background: `linear-gradient(to top, ${color}40, transparent)`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -20, -35],
            opacity: [0, 0.6, 0],
            scaleX: [1, 1.8, 2.5],
            scaleY: [1, 1.3, 0.8],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: steam.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
