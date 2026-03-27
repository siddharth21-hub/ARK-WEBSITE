'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WordSplit from './WordSplit';
import styles from './Services.module.css';

const services = [
  {
    id: 'svc-01', label: 'Websites', name: 'Websites and Landing Pages',
    description: 'A complete business website or campaign page — designed, built, and written by me. Not a template filled in with your text. Built from scratch to represent your business exactly.',
    tags: ['Websites', 'Landing Pages', 'Copy Included'],
    priceINR: '₹10,000 – ₹25,000', priceUSD: '$80 – $240',
    breakdown: [
      { range: '₹10,000–₹15,000', detail: 'Single page landing page, up to 5 sections, copy written, deployed on Vercel, mobile optimised.' },
      { range: '₹15,000–₹20,000', detail: 'Multi-page website up to 8 pages, contact form, SEO basics, custom domain setup.' },
      { range: '₹20,000–₹25,000', detail: 'Full business site with animations, custom interactions, blog or portfolio section.' },
    ],
  },
  {
    id: 'svc-02', label: 'Web Apps', name: 'Web Applications',
    description: 'Custom software built for a specific job your business needs done. Internal tools, customer-facing products, dashboards, booking systems, data platforms. Full stack — front, back, database.',
    tags: ['Custom Software', 'Full Stack', 'Database and API'],
    priceINR: '₹50,000 – ₹5,00,000+', priceUSD: '$600 – $6,000+',
    breakdown: [
      { range: '₹50,000–₹1,00,000', detail: 'Simple web app, single function, basic database, user authentication, deployed.' },
      { range: '₹1,00,000–₹2,50,000', detail: 'Multi-feature app, multiple user roles, complex data, third-party API integrations.' },
      { range: '₹2,50,000–₹5,00,000+', detail: 'Full platform, advanced features, real-time data, complex business logic, scalable architecture.' },
    ],
  },
  {
    id: 'svc-03', label: 'Automation', name: 'Automation Systems',
    description: 'The manual steps that slow your business down — forms copied to spreadsheets, emails sent one by one, documents processed by hand — replaced by systems that do it automatically.',
    tags: ['Workflow Automation', 'Email Pipelines', 'Document Processing'],
    priceINR: '₹8,000 – ₹40,000', priceUSD: '$100 – $480',
    breakdown: [
      { range: '₹8,000–₹15,000', detail: 'Single automation, one trigger, one output. Form to email, document to sheet.' },
      { range: '₹15,000–₹25,000', detail: 'Multi-step workflow, conditional logic, multiple integrations, error handling.' },
      { range: '₹25,000–₹40,000', detail: 'Complex pipeline, multiple triggers, branching logic, data transformation, multiple outputs.' },
    ],
  },
  {
    id: 'svc-04', label: 'Intelligence', name: 'Integrated Intelligence Products',
    description: 'Software that uses intelligence to make decisions, answer questions, process documents, or handle tasks that previously needed a person. Not technology for its own sake — where it genuinely replaces manual work or improves a result.',
    tags: ['Intelligent Chatbots', 'Autonomous Agents', 'Document Intelligence', 'Lead Scoring'],
    priceINR: '₹25,000 – ₹1,00,000', priceUSD: '$300 – $1,200',
    breakdown: [
      { range: '₹25,000–₹40,000', detail: 'FAQ chatbot with knowledge base, document Q&A, basic lead scoring.' },
      { range: '₹40,000–₹70,000', detail: 'Intelligent agent with tool use, email classification, document extraction and filing.' },
      { range: '₹70,000–₹1,00,000', detail: 'Multi-agent system, complex decision making, integrated with existing business tools.' },
    ],
  },
  {
    id: 'svc-05', label: 'Full Systems', name: 'Intelligent Business Systems',
    description: 'The complete build — a full-stack application with intelligence built in from the start. Not a website with a chatbot added on. A system designed end to end.',
    tags: ['Full Stack', 'Intelligence Embedded', 'End to End Build'],
    priceINR: null, priceUSD: null,
    priceLabel: 'Scoped per project — start with a conversation.',
    breakdown: null,
  },
  {
    id: 'svc-06', label: 'Retainer', name: 'Ongoing Retainer',
    description: 'After delivery, I stay on. New features, fixes, monitoring, improvements — monthly.',
    tags: ['Monthly Maintenance', 'System Expansion', 'Ongoing Support'],
    priceINR: null, priceUSD: null, priceLabel: 'Scoped per engagement.', breakdown: null,
  },
  {
    id: 'svc-07', label: 'Copy', name: 'Writing and Copy',
    description: 'The words that go on your website, product, or landing page. Written to make someone understand what you offer and want to reach out. Included in every website build.',
    tags: ['Website Copy', 'Product Copy', 'Positioning'],
    priceINR: '₹5,000 – ₹20,000', priceUSD: '$60 – $240',
    breakdown: [
      { range: '₹5,000–₹10,000', detail: 'Landing page copy, up to 6 sections.' },
      { range: '₹10,000–₹15,000', detail: 'Full website copy, up to 10 pages.' },
      { range: '₹15,000–₹20,000', detail: 'Brand voice, positioning, website copy, one month of content direction.' },
    ],
  },
];

function PriceModal({ service, onClose }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const panelVariants = isMobile
    ? { initial: { opacity: 0, y: '100%' }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: '60%' } }
    : { initial: { opacity: 0, scale: 0.94, y: 16 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 8 } };

  return (
    <>
      <motion.div
        className={styles.modalBackdrop}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClose} aria-hidden="true"
      />
      <motion.div
        className={styles.modal + (isMobile ? ' ' + styles.modalMobile : '')}
        role="dialog" aria-modal="true"
        variants={panelVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          className={styles.modalClose} onClick={onClose} aria-label="Close"
          whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}
        >
          ×
        </motion.button>
        <p className={styles.modalLabel}>Pricing breakdown</p>
        <h3 className={styles.modalTitle}>{service.name}</h3>
        <div className={styles.modalBreakdown}>
          {service.breakdown.map((tier, i) => (
            <motion.div
              key={i} className={styles.modalTier}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.modalRange}>{tier.range}</p>
              <p className={styles.modalDetail}>{tier.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default function Services() {
  const [activeId, setActiveId] = useState('svc-01');
  const [modalService, setModalService] = useState(null);
  const svcRefs = useRef({});
  const containerRef = useRef(null);
  const pillRefs = useRef({});
  // Only scroll pill into view when user explicitly clicks — not from IntersectionObserver
  const userClickedRef = useRef(false);

  useEffect(() => {
    if (!userClickedRef.current) return;
    userClickedRef.current = false;
    const el = pillRefs.current[activeId];
    if (el) {
      const container = el.parentElement;
      if (container) container.scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
    }
  }, [activeId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); }); },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    services.forEach((svc) => { const el = svcRefs.current[svc.id]; if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollToService = (id) => {
    userClickedRef.current = true;
    setActiveId(id);
    const el = svcRefs.current[id];
    if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 120; window.scrollTo({ top, behavior: 'smooth' }); }
  };

  return (
    <section className={styles.section} id="services">
      <div className={styles.inner + ' section-inner'}>
        <div className={'reveal ' + styles.curvedBlock}>
          <div className={'svc-block ' + styles.topRow}>
            <p className={'mono-label ' + styles.sectionLabel}>What I build</p>
            <WordSplit text="Services" className={styles.heading} />
          </div>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <div className={styles.sidebarList}>
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    className={styles.sidebarItem + (activeId === svc.id ? ' ' + styles.sidebarItemActive : '')}
                    onClick={() => scrollToService(svc.id)}
                  >
                    <span className={styles.sidebarNum}>{svc.id.replace('svc-', '')}</span>
                    <span className={styles.sidebarName}>{svc.label}</span>
                  </button>
                ))}
              </div>
            </aside>
            <div className={styles.panels} ref={containerRef}>
              {services.map((svc) => (
                <div
                  key={svc.id} id={svc.id}
                  ref={(el) => { svcRefs.current[svc.id] = el; }}
                  className={'service-block svc-block reveal ' + styles.svcBlock}
                >
                  <h3 className={styles.svcName}>{svc.name}</h3>
                  <p className={styles.svcDesc}>{svc.description}</p>
                  <div className={styles.svcPriceRow}>
                    {svc.priceINR ? (
                      <button
                        className={styles.priceBtn}
                        onClick={() => svc.breakdown && setModalService(svc)}
                        style={{ cursor: svc.breakdown ? 'pointer' : 'default' }}
                      >
                        <span className={styles.priceINR}>{svc.priceINR}</span>
                        <span className={styles.priceUSD}>{svc.priceUSD}</span>
                      </button>
                    ) : (
                      <p className={styles.priceFlex}>{svc.priceLabel}</p>
                    )}
                  </div>
                  <div className={styles.svcFooter}>
                    {svc.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mobilePills}>
            {services.map((svc) => (
              <button
                key={svc.id}
                ref={(el) => { pillRefs.current[svc.id] = el; }}
                className={styles.pill + (activeId === svc.id ? ' ' + styles.pillActive : '')}
                onClick={() => scrollToService(svc.id)}
              >
                {svc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {modalService && (
          <div className={styles.modalRoot}>
            <PriceModal service={modalService} onClose={() => setModalService(null)} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
