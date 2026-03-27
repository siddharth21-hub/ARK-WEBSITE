'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './WordSplit.module.css';

/**
 * Word-by-word scroll-triggered heading.
 * Each word slides up from overflow:hidden mask when section enters viewport.
 *
 * Props:
 *   text      — heading text string
 *   as        — HTML tag, default 'h2'
 *   className — extra class names (applied to the wrapper element)
 *   delay     — base delay before first word, default 0
 */
export default function WordSplit({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordMask}>
          <motion.span
            className={styles.word}
            initial={{ y: 32, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.1,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
