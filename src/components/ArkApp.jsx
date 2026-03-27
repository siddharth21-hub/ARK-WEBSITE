'use client'

import { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Nav from './Nav';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Services from './Services';
import Work from './Work';
import Demos from './Demos';
import Fomo from './Fomo';
import Social from './Social';
import Contact from './Contact';
import Footer from './Footer';
import ContactModal from './ContactModal';
import FloatingChat from './FloatingChat';
import CustomCursor from './CustomCursor';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ArkApp() {
  const [modalOpen, setModalOpen] = useState(false);

  // Initialise Lenis smooth scroll — desktop only
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const lenis = new Lenis({ infinite: false });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Initialise scroll reveal across entire page
  useScrollReveal();

  return (
    <>
      {/* ── Custom cursor (desktop only) ── */}
      <CustomCursor />

      {/* ── Navigation ── */}
      <Nav onOpenModal={() => setModalOpen(true)} />

      {/* ── 1. Hero ── */}
      <Hero onOpenModal={() => setModalOpen(true)} />

      {/* ── 2. How it works ── */}
      <HowItWorks />

      {/* ── 3. Services ── */}
      <Services />

      {/* ── 4. Work / Case Studies ── */}
      <Work />

      {/* ── 5. Live Demos ── */}
      <Demos />

      {/* ── 6. FOMO infographic ── */}
      <Fomo />

      {/* ── 7. Social links ── */}
      <Social />

      {/* ── 8. Contact ── */}
      <Contact />

      {/* ── 9. Footer (dark) ── */}
      <Footer onOpenModal={() => setModalOpen(true)} />

      {/* ── Fixed: floating chat + contact modal ── */}
      <FloatingChat />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
