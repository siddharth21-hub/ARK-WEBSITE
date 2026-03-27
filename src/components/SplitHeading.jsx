'use client'

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SplitHeading.module.css';

/**
 * Scroll-triggered character-split heading.
 * Each character slides up from an overflow:hidden mask when the element
 * enters the viewport.
 *
 * Props:
 *   text      — heading text string
 *   as        — HTML tag (h2, h3, etc.) default 'h2'
 *   className — additional class names
 *   delay     — base delay in seconds before first char animates (default 0)
 */
export default function SplitHeading({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split on words to preserve natural word-break behaviour
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className={styles.word}>
          {Array.from(word).map((char, ci) => {
            const globalIdx = words.slice(0, wi).reduce((a, w) => a + w.length, 0) + ci;
            return (
              <span key={ci} className={styles.charMask}>
                <motion.span
                  className={styles.char}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: [0.86, 0, 0.31, 1],
                    delay: delay + globalIdx * 0.025,
                  }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
