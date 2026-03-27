'use client'

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.display = 'block';

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const render = () => {
      const { x, y } = posRef.current;
      cursor.style.setProperty('--cursor-x', `${x}px`);
      cursor.style.setProperty('--cursor-y', `${y}px`);
      rafRef.current = requestAnimationFrame(render);
    };

    const onEnterInteractive = () => cursor.classList.add(styles.expanded);
    const onLeaveInteractive = () => cursor.classList.remove(styles.expanded);

    document.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(render);

    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    // MutationObserver to catch dynamically added interactives
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} style={{ display: 'none' }} />;
}
