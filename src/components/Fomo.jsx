'use client'

import { useRef, useEffect } from 'react';
import WordSplit from './WordSplit';
import MagneticButton from './MagneticButton';
import styles from './Fomo.module.css';

const stats = [
  {
    number: '73%',
    label: 'of repetitive business tasks can be fully automated with tools that already exist. Most businesses have automated zero.',
    source: 'McKinsey Global Institute, 2023',
    value: 73,
    suffix: '%',
  },
  {
    number: '6hrs',
    label: 'Average time per day business owners spend on tasks a system could handle. That is over 1,500 hours a year.',
    source: 'Asana State of Work Report, 2023',
    value: 6,
    suffix: 'hrs',
  },
  {
    number: '3×',
    label: 'Faster revenue growth for businesses with integrated operational systems versus those running processes manually.',
    source: 'Deloitte Insights, 2024',
    value: 3,
    suffix: '×',
  },
  {
    number: '40%',
    label: 'Average reduction in operational costs reported by businesses after systematising their core workflows.',
    source: 'McKinsey Digital, 2024',
    value: 40,
    suffix: '%',
  },
];

export default function Fomo() {
  const blockRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const block = blockRef.current;
    if (!block) return;

    const counters = block.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        counters.forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';

          if (prefersReduced) {
            el.textContent = target + suffix;
            return;
          }

          const duration = 1800;
          const startTime = performance.now();
          el.textContent = '0' + suffix;

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.section} id="why-it-matters">
      <div className={`section-inner ${styles.outer}`}>

        {/* Curved dark block — contains all stat content */}
        <div className={`reveal ${styles.curvedBlock}`} ref={blockRef}>

          {/* Heading */}
          <div className={styles.headerBlock}>
            <WordSplit
              text="The businesses pulling ahead aren't working harder."
              className={styles.heading}
            />
            <p className={styles.sub}>
              The difference is operational infrastructure. Here is what the research shows.
            </p>
          </div>

          {/* Stats 2×2 grid */}
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <p
                  className={`stat-number ${styles.statNumber}`}
                  data-target={stat.value}
                  data-suffix={stat.suffix}
                >
                  {stat.number}
                </p>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statSource}>{stat.source}</p>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <p className={styles.bottomCopy}>
            Every month without a system is a month a competitor is using one.
          </p>

          {/* CTA */}
          <MagneticButton>
            <button className={styles.ctaBtn} onClick={scrollToContact}>
              Start a project
            </button>
          </MagneticButton>

        </div>
      </div>
    </section>
  );
}
