'use client'

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactForm } from './Contact';
import styles from './ContactModal.module.css';

export default function ContactModal({ open, onClose }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label="Start a project"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            <h2 className={styles.heading}>Start a project.</h2>
            <p className={styles.sub}>
              Describe what you need. I will tell you what I can build.
            </p>

            <ContactForm dark />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
