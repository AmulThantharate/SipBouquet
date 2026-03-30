'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import {
  getDraftDrinks,
  getDraftTheme,
  getDraftMessage,
  getDraftNames,
  saveDraftMessage,
  saveDraftNames,
  saveGift,
  encodeGift,
} from '@/lib/store';
import type { Drink } from '@/lib/store';

export default function MessagePage() {
  const router = useRouter();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const saved = getDraftDrinks();
    if (saved.length === 0) {
      router.push('/build');
      return;
    }
    setDrinks(saved);
    setMessage(getDraftMessage());
    const names = getDraftNames();
    setSenderName(names.sender);
    setRecipientName(names.recipient);
  }, [router]);

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drinks: drinks.map((d) => d.name),
          recipientName: recipientName || 'friend',
          senderName: senderName || 'someone special',
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
        saveDraftMessage(data.message);
      }
    } catch (err) {
      console.error('Failed to generate message:', err);
      const fallback = `Hey ${recipientName || 'friend'}, I picked out ${drinks.map((d) => d.name).join(', ')} just for you — because you deserve a little warmth and joy today. Sip slowly, smile often. 💛`;
      setMessage(fallback);
      saveDraftMessage(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateGift = () => {
    saveDraftMessage(message);
    saveDraftNames(senderName, recipientName);
    const theme = getDraftTheme();
    
    const giftData = {
      id: '', // Will be set after encoding or used as placeholder
      drinks,
      message,
      senderName: senderName || 'Someone special',
      recipientName: recipientName || 'you',
      theme,
      bouquetStyle: 'cone' as const,
      createdAt: new Date().toISOString(),
    };

    const id = encodeGift(giftData);
    giftData.id = id;

    saveGift(giftData);
    router.push(`/gift/${id}`);
  };

  if (drinks.length === 0) return null;

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8 max-w-xl mx-auto px-4 sm:px-0">
        {/* Header */}
        <div>
          <motion.h1
            className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Add Your Note
          </motion.h1>
          <motion.p
            className="text-espresso-light/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Write a heartfelt message or let AI craft one for you
          </motion.p>
        </div>

        {/* Names - Stack on mobile */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-espresso-light/60 mb-1.5 uppercase tracking-wider">
              From
            </label>
            <input
              id="sender-name"
              type="text"
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                saveDraftNames(e.target.value, recipientName);
              }}
              placeholder="Your name"
              className="w-full bg-white/60 border border-cream-dark/40 rounded-xl px-4 py-3 text-sm text-espresso placeholder:text-espresso-light/30 focus:outline-none focus:ring-2 focus:ring-matcha/30 focus:border-matcha/50 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-medium text-espresso-light/60 mb-1.5 uppercase tracking-wider">
              To
            </label>
            <input
              id="recipient-name"
              type="text"
              value={recipientName}
              onChange={(e) => {
                setRecipientName(e.target.value);
                saveDraftNames(senderName, e.target.value);
              }}
              placeholder="Their name"
              className="w-full bg-white/60 border border-cream-dark/40 rounded-xl px-4 py-3 text-sm text-espresso placeholder:text-espresso-light/30 focus:outline-none focus:ring-2 focus:ring-matcha/30 focus:border-matcha/50 transition-all shadow-sm"
            />
          </div>
        </motion.div>

        {/* AI Generate button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            id="generate-message"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-matcha to-matcha-dark text-white px-6 py-3.5 rounded-xl text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            whileHover={isGenerating ? {} : { scale: 1.01 }}
            whileTap={isGenerating ? {} : { scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    ✨
                  </motion.span>
                  Brewing your message...
                </motion.span>
              ) : (
                <motion.span
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  ✨ Generate AI Message
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Message textarea */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            <textarea
              id="message-input"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                saveDraftMessage(e.target.value);
              }}
              placeholder="Write something warm and wonderful..."
              rows={6}
              maxLength={500}
              className="w-full bg-white/60 border border-cream-dark/40 rounded-2xl px-5 py-4 text-sm sm:text-base text-espresso placeholder:text-espresso-light/30 focus:outline-none focus:ring-2 focus:ring-matcha/30 focus:border-matcha/50 transition-all resize-none font-serif leading-relaxed shadow-sm"
            />
            <div className="absolute bottom-3 right-4 text-[9px] sm:text-[10px] text-espresso-light/30">
              {charCount}/500
            </div>
          </div>
        </motion.div>

        {/* Drinks preview */}
        <motion.div
          className="bg-white/40 rounded-xl px-4 py-3 border border-cream-dark/20 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[10px] font-medium text-espresso-light/40 uppercase tracking-wider mb-2">
            Included in your bouquet
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {drinks.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1 bg-white/60 rounded-full px-2.5 py-1 text-xs shadow-sm border border-white/50"
              >
                <span>{d.emoji}</span>
                <span className="text-espresso-light/70">{d.name}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* Create Gift button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pb-12 sm:pb-8"
        >
          <motion.button
            id="create-gift"
            onClick={handleCreateGift}
            disabled={!message.trim()}
            className="w-full bg-espresso text-cream px-8 py-4 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            whileHover={message.trim() ? { scale: 1.02 } : {}}
            whileTap={message.trim() ? { scale: 0.98 } : {}}
          >
            🎁 Create Your Gift
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
