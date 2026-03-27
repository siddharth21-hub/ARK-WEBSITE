'use client'

import { useRef, useEffect } from 'react';
import styles from './ParticleCanvas.module.css';

const PARTICLE_COUNT = 80;
const CONNECT_DIST = 120;
const REPEL_DIST = 80;
const REPEL_FORCE = 0.8;
const PARTICLE_COLOR = 'rgba(17,17,8,0.2)';
const LINE_COLOR_BASE = 'rgba(17,17,8,';

function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    r: 2.5,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    mouse: { x: -9999, y: -9999 },
    rafId: null,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);

      // Reinit particles if not yet created or if resize changes container
      if (state.particles.length === 0) {
        state.particles = Array.from({ length: PARTICLE_COUNT }, () =>
          makeParticle(state.w, state.h)
        );
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // ── Mouse tracking ───────────────────────────────────────────────────────
    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    }
    // Container receives mouse events (canvas has pointer-events:none)
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // ── Animation loop ───────────────────────────────────────────────────────
    function tick() {
      const { w, h, particles, mouse } = state;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Random walk — keeps particles perpetually moving
        p.vx += (Math.random() - 0.5) * 0.025;
        p.vy += (Math.random() - 0.5) * 0.025;

        // Very soft damping — only prevents runaway acceleration
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < p.r) { p.x = p.r; p.vx *= -1; }
        if (p.x > w - p.r) { p.x = w - p.r; p.vx *= -1; }
        if (p.y < p.r) { p.y = p.r; p.vy *= -1; }
        if (p.y > h - p.r) { p.y = h - p.r; p.vy *= -1; }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = LINE_COLOR_BASE + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ctx.fillStyle = PARTICLE_COLOR;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      state.rafId = requestAnimationFrame(tick);
    }

    state.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.rafId);
      ro.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
