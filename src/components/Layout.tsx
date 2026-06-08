'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const steps = [
  { path: '/build', label: 'Select', number: 1 },
  { path: '/arrange', label: 'Arrange', number: 2 },
  { path: '/message', label: 'Message', number: 3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isGiftPage = pathname.startsWith('/gift/');

  if (isHome || isGiftPage) {
    return <>{children}</>;
  }

  const currentStep = steps.findIndex((s) => s.path === pathname);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-cream-dark/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-xl">☕</span>
            <span className="font-serif text-base sm:text-lg font-semibold text-espresso group-hover:text-mocha transition-colors">
              SipBouquet
            </span>
          </Link>

          {/* Step indicator */}
          <nav className="flex items-center" aria-label="Build steps">
            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;

              return (
                <div key={step.path} className="flex items-center">
                  <Link
                    href={step.path}
                    className={`
                      flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all duration-300
                      ${
                        isActive
                          ? 'bg-espresso text-cream'
                          : isCompleted
                            ? 'bg-matcha-light/40 text-espresso-light'
                            : 'text-espresso-light/40 hover:text-espresso-light/70'
                      }
                    `}
                  >
                    <span
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold
                      ${
                        isActive
                          ? 'bg-cream text-espresso'
                          : isCompleted
                            ? 'bg-matcha text-white'
                            : 'bg-cream-dark text-espresso-light/50'
                      }
                    `}
                    >
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <span className="hidden xs:inline sm:inline">{step.label}</span>
                  </Link>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-3 sm:w-6 h-px mx-0.5 sm:mx-1 ${isCompleted ? 'bg-matcha' : 'bg-cream-dark'}`}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
