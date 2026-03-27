'use client'

import styles from './Social.module.css';
import WordSplit from './WordSplit';

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siddharthshukla21/' },
  { label: 'Twitter / X', href: 'https://twitter.com/sid_anushukla' },
  { label: 'Substack', href: 'https://substack.com/@siddharthshuklaofficial' },
  { label: 'Instagram', href: 'https://www.instagram.com/sid.subtext/' },
];

export default function Social() {
  return (
    <section className={styles.section} id="social">
      <div className={`section-inner ${styles.inner}`}>
        <WordSplit text="Find me elsewhere." className={styles.heading} />

        <div className={`social-row reveal ${styles.linksRow}`}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {label}
            </a>
          ))}
        </div>

        <p className={`social-note reveal ${styles.note}`}>
          I also write. @sid.subtext on Instagram — notes on human nature and first-principles examinations of why people and societies behave the way they do.
        </p>
      </div>
    </section>
  );
}
