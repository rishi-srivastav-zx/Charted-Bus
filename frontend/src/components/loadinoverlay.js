"use client";
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

/* ══════════════════════════════════════════════════════
   WHEEL COMPONENT — from your animation
══════════════════════════════════════════════════════ */
const Wheel = () => (
  <motion.div 
    className="w-8 h-8 bg-zinc-900 rounded-full border-4 border-zinc-800 flex items-center justify-center relative shadow-md"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
  >
    {/* Tire Tread Detail */}
    <div className="absolute inset-0 rounded-full border border-zinc-700/30" />
    
    {/* Hubcap */}
    <div className="w-5 h-5 bg-zinc-700 rounded-full border border-zinc-600 flex items-center justify-center">
      {/* Center Cap */}
      <div className="w-2 h-2 bg-zinc-800 rounded-full" />
      
      {/* Lug Nuts / Spokes */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-zinc-500 rounded-full"
          style={{
            transform: `rotate(${i * 60}deg) translateY(-6px)`
          }}
        />
      ))}
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════
   BUS ANIMATION COMPONENT — your exact code
══════════════════════════════════════════════════════ */
const BusAnimation = () => (
  <div className="relative w-64 h-32 flex items-center justify-center">
    {/* Road line */}
    <div className="absolute bottom-4 w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full w-1/2 bg-zinc-400"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>

    {/* Speed Lines */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-zinc-300"
          style={{
            width: Math.random() * 40 + 20,
            top: 20 + i * 25,
            left: '100%',
          }}
          animate={{
            left: '-20%',
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear"
          }}
        />
      ))}
    </div>

    {/* Bus Container */}
    <motion.div
      className="relative z-10"
      animate={{
        y: [0, -2, 0, -1, 0],
        rotate: [0, -0.5, 0, 0.5, 0]
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Exhaust Smoke */}
      <div className="absolute -left-4 bottom-4 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-zinc-400/20 rounded-full blur-sm"
            animate={{
              x: [-10, -40],
              y: [0, -20],
              scale: [1, 2.5],
              opacity: [0.6, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Bus Body */}
      <div className="relative bg-zinc-800 w-48 h-20 rounded-t-2xl rounded-b-md shadow-2xl flex items-center overflow-visible border-b-4 border-zinc-900">
        {/* Front Windshield */}
        <div className="absolute right-0 top-2 w-12 h-10 bg-sky-400/30 rounded-l-sm border-r-4 border-zinc-900 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-full h-full"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Side Windows */}
        <div className="absolute top-2 left-4 right-14 h-8 flex gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 bg-zinc-700/50 rounded-sm relative overflow-hidden border border-zinc-900/50">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5" />
            </div>
          ))}
        </div>

        {/* Door */}
        <div className="absolute left-10 bottom-0 w-10 h-14 border-x border-t border-zinc-900/50 rounded-t-sm bg-zinc-800/50" />
        
        {/* Side Mirror */}
        <div className="absolute -right-2 top-6 w-3 h-5 bg-zinc-900 rounded-sm shadow-md" />
        
        {/* Headlight & Beam */}
        <div className="absolute right-1 top-12 w-3 h-4 bg-yellow-100 rounded-sm shadow-[0_0_15px_rgba(254,249,195,0.8)]" />
        <div className="absolute -right-16 top-10 w-20 h-12 bg-yellow-200/10 blur-xl rounded-full pointer-events-none" />
        
        {/* Tail light */}
        <div className="absolute left-1 top-12 w-2 h-4 bg-red-600 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        
        {/* Wheel Arches */}
        <div className="absolute -bottom-1 left-6 w-10 h-5 bg-zinc-900 rounded-t-full" />
        <div className="absolute -bottom-1 right-10 w-10 h-5 bg-zinc-900 rounded-t-full" />

        {/* Branding/Line Number */}
        <div className="absolute left-4 bottom-2 px-1.5 py-0.5 bg-yellow-400 rounded-sm text-[8px] font-bold text-zinc-900 uppercase tracking-tighter">
          Line 42
        </div>
      </div>

      {/* Wheels */}
      <div className="absolute -bottom-3 left-7 right-11 flex justify-between">
        <Wheel />
        <Wheel />
      </div>
    </motion.div>
  </div>
);

/* ══════════════════════════════════════════════════════
   MAIN HOOK — all previous functions preserved
══════════════════════════════════════════════════════ */
export default function useLoadingNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ── navigate (unchanged) ── */
  const navigate = useCallback((url) => {
    if (isLoading) return;

    router.prefetch(url);
    setIsLoading(true);
    setProgress(0);

    let current = 0;

    const interval = setInterval(() => {
      current += Math.random() * 14 + 8;

      if (current >= 85) {
        clearInterval(interval);
      }

      setProgress(Math.min(current, 85));
    }, 160);

    setTimeout(() => {
      router.push(url);
    }, 500);

  }, [isLoading, router]);

  /* ── pathname effect (unchanged) ── */
  useEffect(() => {
    if (isLoading) {
      setProgress(100);

      const timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  /* ── status text (unchanged) ── */
  const statusText =
    progress < 25 ? "Searching routes..." :
    progress < 55 ? "Scanning fleet..." :
    progress < 80 ? "Getting best price..." :
    progress < 100 ? "Almost ready..." :
    "Let's go! 🎉";

  /* ── LoadingOverlay with YOUR bus animation ── */
  const LoadingOverlay = () => (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            backdropFilter: 'blur(24px) brightness(0.6)',
            WebkitBackdropFilter: 'blur(24px) brightness(0.6)',
            background: 'rgba(0,0,0,0.45)',
          }}
        >
          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #fafafa 0%, #f4f4f5 100%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 40px 80px rgba(0,0,0,0.3)',
            }}
          >
            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-2">
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange-500/70 font-mono mb-1"
              >
                ◆ &nbsp;Booking Engine
              </motion.p>

              <div className="flex items-start justify-between">
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-extrabold text-zinc-800 tracking-tight leading-tight"
                >
                  Finding your<br />
                  <span className="text-orange-500">perfect ride</span>
                </motion.h2>

                {/* % counter badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={Math.round(progress)}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-sm font-black text-orange-500 font-mono"
                    >
                      {Math.round(progress)}%
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* ── YOUR Bus Animation Scene ── */}
            <div className="px-4 py-4">
              <div className="relative h-40 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <BusAnimation />
              </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="px-6 pb-2">
              <div className="h-1 rounded-full bg-zinc-200 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-orange-500 relative overflow-hidden"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </div>

            {/* ── Footer status bar ── */}
            <div className="mx-6 mb-6 p-3 bg-zinc-100/50 border border-zinc-200 rounded-xl flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusText}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs text-zinc-500 font-mono"
                >
                  {statusText}
                </motion.span>
              </AnimatePresence>

              {/* bouncing dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i}
                    className="w-1.5 h-1.5 rounded-full bg-orange-500"
                    animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.16, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { navigate, LoadingOverlay, isLoading, progress };
}