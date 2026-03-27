'use client'

import { useState } from 'react';
import WordSplit from './WordSplit';
import MagneticButton from './MagneticButton';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Contact.module.css';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

const SERVICE_OPTIONS = [
  'Website or Landing Page',
  'Web Application',
  'Automation System',
  'Integrated Intelligence Product',
  'Intelligent Business System',
  'Ongoing Retainer',
  'Writing and Copy',
  'Something else — I will describe below',
];

const FORMSPREE_URL = 'https://formspree.io/f/xnjoarpk';

export function ContactForm({ dark = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    serviceOther: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const showOtherField = formData.service === 'Something else — I will describe below';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        _subject: 'New project inquiry — Ark',
        name: formData.name,
        email: formData.email,
        service: formData.service,
        ...(showOtherField && { serviceDescription: formData.serviceOther }),
        description: formData.description,
      };

      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = dark ? styles.inputDark : styles.input;
  const textareaClass = dark ? styles.textareaDark : styles.textarea;
  const labelClass = dark ? `${styles.fieldLabel} ${styles.fieldLabelDark}` : styles.fieldLabel;

  if (submitted) {
    return (
      <div className={styles.confirmation}>
        Received. Expect a reply within 24 hours.
      </div>
    );
  }

  return (
    <form className={`contact-form ${styles.form}`} onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="_subject" value="New project inquiry — Ark" />

      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={labelClass} htmlFor={dark ? 'name-modal' : 'name'}>
            Name
          </label>
          <input
            id={dark ? 'name-modal' : 'name'}
            name="name"
            type="text"
            className={inputClass}
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>
        <div className={styles.field}>
          <label className={labelClass} htmlFor={dark ? 'email-modal' : 'email'}>
            Email
          </label>
          <input
            id={dark ? 'email-modal' : 'email'}
            name="email"
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={labelClass}>
          What you need
        </label>
        <Select
          value={formData.service}
          onValueChange={(val) => setFormData((prev) => ({ ...prev, service: val }))}
          dark={dark}
        >
          <SelectTrigger placeholder="Select a service…" />
          <SelectContent>
            {SERVICE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence>
        {showOtherField && (
          <motion.div
            className={styles.field}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <input
              name="serviceOther"
              type="text"
              className={inputClass}
              value={formData.serviceOther}
              onChange={handleChange}
              placeholder="Describe what you are looking for…"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.field}>
        <label className={labelClass} htmlFor={dark ? 'desc-modal' : 'description'}>
          Tell me more
        </label>
        <textarea
          id={dark ? 'desc-modal' : 'description'}
          name="description"
          rows={4}
          className={textareaClass}
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell me more about the problem or what needs to exist…"
        />
      </div>

      {error && (
        <p className={styles.error}>{error}</p>
      )}

      <MagneticButton>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Sending…' : 'Send request →'}
        </button>
      </MagneticButton>
    </form>
  );
}

export default function Contact() {
  return (
    <section className={styles.section} id="contact">
      {/* Background watermark */}
      <span className={styles.watermark} aria-hidden="true">Ark</span>

      <div className={`section-inner ${styles.inner}`}>
        <div className={`contact-heading reveal ${styles.header}`}>
          <WordSplit text="Start a project." className={styles.heading} />
          <p className={styles.sub}>
            Describe what you need. I will tell you what I can build.
          </p>
        </div>

        <div className={`contact-form reveal ${styles.formWrap}`}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
