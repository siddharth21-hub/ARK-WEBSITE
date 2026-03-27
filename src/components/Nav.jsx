'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Nav.module.css';

export default function Nav({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [logoCollapsed, setLogoCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Track scroll for nav background (24px) and logo collapse (80px)
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setLogoCollapsed(y > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Search filter: dim non-matching content
  const handleSearch = useCallback((e) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);

    const serviceBlocks = document.querySelectorAll('.service-block');
    const csRows = document.querySelectorAll('.cs-row');
    const demoItems = document.querySelectorAll('.demo-item');

    const allTargets = [...serviceBlocks, ...csRows, ...demoItems];

    if (!query) {
      allTargets.forEach((el) => { el.style.opacity = ''; });
      return;
    }

    allTargets.forEach((el) => {
      const text = el.textContent.toLowerCase();
      el.style.opacity = text.includes(query) ? '1' : '0.1';
      el.style.transition = 'opacity 0.25s';
    });
  }, []);

  // On Enter: scroll to first visible match
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const serviceBlocks = document.querySelectorAll('.service-block');
      const csRows = document.querySelectorAll('.cs-row');
      const demoItems = document.querySelectorAll('.demo-item');
      const allTargets = [...serviceBlocks, ...csRows, ...demoItems];
      const first = allTargets.find((el) => el.style.opacity !== '0.1');
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="top">
        <div className={`${styles.inner} ${logoCollapsed ? styles.innerCompact : ''}`}>
          {/* Logo — A stays, rk collapses on scroll */}
          <a
            href="#top"
            className={styles.logo}
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className={styles.logoA}>A</span>
            <span className={`${styles.logoRk} ${logoCollapsed ? styles.logoRkHidden : ''}`}>rk</span>
          </a>

          {/* Centre search */}
          <div className={styles.searchWrap}>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search services, work, demos..."
              className={styles.search}
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search site content"
            />
          </div>

          {/* Desktop nav links */}
          <div className={styles.links}>
            <button className={styles.link} onClick={() => scrollTo('work')}>Work</button>
            <button className={styles.link} onClick={() => scrollTo('services')}>Services</button>
            <button className={styles.link} onClick={() => scrollTo('demos')}>Demos</button>
            <button className={styles.connectBtn} onClick={() => scrollTo('social')}>Connect</button>
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className={styles.mobilePanel}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.mobileClose}
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              ×
            </button>
            <nav className={styles.mobileLinks}>
              <button onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</button>
              <button onClick={() => scrollTo('services')}>Services</button>
              <button onClick={() => scrollTo('work')}>Work</button>
              <button onClick={() => scrollTo('demos')}>Demos</button>
              <button onClick={() => scrollTo('contact')}>Contact</button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
