import { useEffect, useRef } from 'react';

/**
 * Attaches IntersectionObserver to all .reveal elements within the given
 * container (defaults to document). Adds .revealed class when element
 * enters viewport. Stagger siblings with CSS --reveal-delay.
 */
export function useScrollReveal(containerRef = null) {
  useEffect(() => {
    const root = containerRef?.current ?? document;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -32px 0px',
      }
    );

    const elements = root.querySelectorAll('.reveal');

    elements.forEach((el) => {
      // Apply stagger delay to sibling groups
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
        const idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.setProperty('--reveal-delay', `${idx * 70}ms`);
        }
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [containerRef]);
}
