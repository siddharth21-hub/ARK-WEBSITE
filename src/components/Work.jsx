'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WordSplit from './WordSplit';
import styles from './Work.module.css';

const caseStudies = [
  {
    num: '01',
    category: 'Web App',
    heading: 'Tournament Bracket App',
    description: 'A custom web application for managing sports tournament brackets. Dynamic standings, match progression, and persistent state — built entirely as a client-side application.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    link: { label: 'View Project', href: 'https://tournament-app-lemon.vercel.app/' },
  },
  {
    num: '02',
    category: 'Automation + Intelligence',
    heading: 'AI Lead Qualifier',
    description: 'An automated lead qualification system. A visitor fills a form, the submission is scored by an intelligent model, hot leads flagged immediately, others filed automatically.',
    stack: ['n8n', 'Claude API', 'Vercel'],
    link: { label: 'View Demo', href: 'https://lead-qualifier-demo-sigma.vercel.app' },
  },
  {
    num: '03',
    category: 'Intelligence Pipeline',
    heading: 'FAQ Chatbot — Knowledge Retrieval Pipeline',
    description: 'A Google Drive document becomes a queryable knowledge base. Drop a file into a folder — automatically chunked, embedded, indexed, and available for the chatbot to answer from instantly.',
    stack: ['n8n', 'Pinecone', 'OpenAI Embeddings', 'Google Drive'],
    link: { label: 'See Live Demo', href: '#demos', internal: true },
  },
  {
    num: '04',
    category: 'Automation',
    heading: 'Invoice Processing Automation',
    description: 'PDF invoices dropped into a folder are read by an extraction model, key data pulled regardless of format, filed to a database, and the billing team notified — automatically.',
    stack: ['n8n', 'Google Drive', 'Gemini', 'Google Sheets'],
    link: null,
  },
];

// Framer-motion slide variants — direction 1 = next (→), -1 = prev (←)
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? '-60%' : '60%',
    opacity: 0,
  }),
};

export default function Work() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = caseStudies.length;

  const go = useCallback((newIdx) => {
    setDirection(newIdx > index ? 1 : -1);
    setIndex(newIdx);
  }, [index]);

  const prev = () => go(index > 0 ? index - 1 : total - 1);
  const next = () => go(index < total - 1 ? index + 1 : 0);

  const cs = caseStudies[index];

  const handleLink = (e, href, internal) => {
    if (internal && href.startsWith('#')) {
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.section} id="work">
      <div className={`section-inner ${styles.inner}`}>

        {/* Header */}
        <div className={`reveal ${styles.header}`}>
          <p className={`mono-label ${styles.label}`}>Selected work</p>
          <WordSplit text="Things I have built." className={styles.heading} />
          <p className={styles.sub}>
            Four projects. Each one a working system — not a mockup, not a concept.
          </p>
        </div>

        {/* Carousel */}
        <div className={`cs-row reveal ${styles.carousel}`}>

          {/* Slide area */}
          <div className={styles.slideViewport}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                className={styles.card}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Large faint background number */}
                <span className={styles.bgNum} aria-hidden="true">{cs.num}</span>

                <div className={styles.cardBody}>
                  {/* Left meta */}
                  <div className={styles.cardLeft}>
                    <p className={styles.cardNum}>{cs.num}</p>
                    <span className={styles.cardCategory}>{cs.category}</span>
                  </div>

                  {/* Right content */}
                  <div className={styles.cardRight}>
                    <h3 className={styles.csHeading}>{cs.heading}</h3>
                    <p className={styles.csDesc}>{cs.description}</p>
                    <p className={styles.csStack}>{cs.stack.join(' · ')}</p>
                    {cs.link ? (
                      <a
                        href={cs.link.href}
                        className={styles.csLink}
                        target={cs.link.internal ? undefined : '_blank'}
                        rel={cs.link.internal ? undefined : 'noopener noreferrer'}
                        onClick={cs.link.internal ? (e) => handleLink(e, cs.link.href, true) : undefined}
                      >
                        {cs.link.label} →
                      </a>
                    ) : (
                      <span className={styles.csAvailable}>Available on request</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls row */}
          <div className={styles.controls}>
            {/* Arrows */}
            <div className={styles.arrows}>
              <button
                className={styles.arrow}
                onClick={prev}
                aria-label="Previous project"
                disabled={index === 0}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 14l-5-5 5-5" />
                </svg>
              </button>
              <button
                className={styles.arrow}
                onClick={next}
                aria-label="Next project"
                disabled={index === total - 1}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 4l5 5-5 5" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className={styles.dots} role="tablist" aria-label="Projects">
              {caseStudies.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                  onClick={() => go(i)}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Project ${i + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
