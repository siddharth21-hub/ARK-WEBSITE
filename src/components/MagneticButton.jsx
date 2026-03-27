'use client'

import { useRef, useState, useCallback } from 'react';
import styles from './MagneticButton.module.css';

/**
 * Magnetic cursor wrapper for CTA buttons.
 * Desktop only (pointer: fine).
 * Wraps a single child element and pulls it toward the cursor when nearby.
 *
 * Usage:
 *   <MagneticButton>
 *     <button className="my-cta">Book a call</button>
 *   </MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.35 }) {
  const wrapRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
    setLeaving(false);
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setLeaving(true);
  }, []);

  return (
    <span
      ref={wrapRef}
      className={styles.wrap}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={styles.inner}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: leaving
            ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.1s linear',
        }}
      >
        {children}
      </span>
    </span>
  );
}
