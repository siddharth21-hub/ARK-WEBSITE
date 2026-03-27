'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWidget } from './Demos';
import styles from './FloatingChat.module.css';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on click outside the entire container (button + overlay)
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Chat overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
          >
            <div className={styles.header}>
              <span className={styles.headerLabel}>Ask anything</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
            <ChatWidget compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <button
        className={styles.btn}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
