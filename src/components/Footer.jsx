'use client'

import styles from './Footer.module.css';

const pageLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Demos', href: '#demos' },
  { label: 'Start a project', href: '#contact' },
];

const elsewhereLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/siddharthshukla21/' },
  { label: 'Twitter', href: 'https://twitter.com/sid_anushukla' },
  { label: 'Substack', href: 'https://substack.com/@siddharthshuklaofficial' },
  { label: 'Instagram', href: 'https://www.instagram.com/sid.subtext/' },
];

export default function Footer({ onOpenModal }) {
  const handlePageLink = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#contact') {
        onOpenModal?.();
      } else {
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`section-inner ${styles.inner}`}>
        {/* Top row */}
        <div className={styles.topRow}>
          {/* Left: brand */}
          <div className={styles.brand}>
            <p className={styles.brandName}>Ark</p>
            <p className={styles.brandBy}>by Siddharth Shukla</p>
            <p className={styles.brandTagline}>The build behind the idea.</p>
          </div>

          {/* Right: links */}
          <div className={styles.linksGrid}>
            <div className={styles.linkCol}>
              <p className={styles.colLabel}>Pages</p>
              {pageLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.link}
                  onClick={(e) => handlePageLink(e, href)}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className={styles.linkCol}>
              <p className={styles.colLabel}>Elsewhere</p>
              {elsewhereLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2026 Ark. Built by Siddharth Shukla.
          </p>
        </div>
      </div>
    </footer>
  );
}
