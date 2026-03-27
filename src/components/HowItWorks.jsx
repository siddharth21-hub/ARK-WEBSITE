'use client'

import WordSplit from './WordSplit';
import styles from './HowItWorks.module.css';

const steps = [
  {
    num: '01',
    title: 'You describe the problem',
    body: 'One conversation. Tell me what is not working, what is missing, or what needs to exist. Plain language — no technical knowledge required from you.',
  },
  {
    num: '02',
    title: 'I design and build it',
    body: 'Depending on what you need — a website, a web application, an automation system, or an integrated product — I scope it, build it, and deliver something that works. Not a proposal. Not a prototype.',
  },
  {
    num: '03',
    title: 'It runs. You grow.',
    body: 'Delivery is not the end. I maintain what I build and expand it as your business grows. Everything is available on a monthly retainer.',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={`section-inner ${styles.inner}`}>
        <p className={`mono-label reveal ${styles.label}`}>
          How it works
        </p>
        <WordSplit
          text="Three steps. One result."
          className={styles.heading}
        />

        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`step-card reveal ${styles.card}`}
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              {/* Decorative step number — faint, top-left */}
              <span className={styles.cardBgNum} aria-hidden="true">
                {step.num}
              </span>

              <p className={styles.stepNum}>{step.num}</p>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
