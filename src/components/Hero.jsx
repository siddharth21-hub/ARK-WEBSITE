'use client'

import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import ParticleCanvas from './ParticleCanvas';
import MagneticButton from './MagneticButton';

// ── Character-split heading for page-load animation ───────────────────────
function AnimatedHeadline({ text, className, delay = 0 }) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((char, i) => (
        <span key={i} className={styles.charMask}>
          <motion.span
            className={styles.char}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.86, 0, 0.31, 1],
              delay: delay + i * 0.03,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
export default function Hero({ onOpenModal }) {
  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={`section-inner ${styles.inner}`}>

        {/* Left column */}
        <div className={styles.content}>
          <motion.p
            className={`${styles.label} mono-label`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
          >
            Ark · Systems Architecture · Est. 2026
          </motion.p>

          <h1 className={styles.headline}>
            <AnimatedHeadline text="From idea" className={styles.headlineLine} delay={0.2} />
            <br />
            <AnimatedHeadline text="to operation." className={`${styles.headlineLine} ${styles.headlineNoWrap}`} delay={0.5} />
          </h1>

          {/* Curved dark block — subtext + CTAs */}
          <motion.div
            className={styles.darkBlock}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.95 }}
          >
            <p className={styles.subtextP1}>
              Some businesses need to be built from the ground up.
            </p>
            <p className={styles.subtextP2}>
              Others need what exists to actually work.
              I design, build, and run the complete stack.
            </p>
            <div className={styles.ctaRow}>
              <MagneticButton>
                <button className={styles.ctaPrimary} onClick={onOpenModal}>
                  Book a call
                </button>
              </MagneticButton>
              <button className={styles.ctaGhost} onClick={scrollToWork}>
                See the work
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right column — particle canvas (desktop only) */}
        <motion.div
          className={styles.visual}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.7 }}
        >
          <ParticleCanvas />
        </motion.div>

      </div>
    </section>
  );
}
