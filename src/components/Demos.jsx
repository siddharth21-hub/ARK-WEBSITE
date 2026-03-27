'use client'

import { useState, useRef, useEffect } from 'react';
import WordSplit from './WordSplit';
import styles from './Demos.module.css';
import { ChipGroup } from '@/components/ui/chips';

const WEBHOOK_URL = 'https://sidshukla.app.n8n.cloud/webhook/daaa0676-e7b3-4a69-b1d1-9a390ae6d56b/chat';

const PILLS = [
  'What does a website cost?',
  'How long does a project take?',
  'Do you work internationally?',
];

const OPENING_MSG = {
  role: 'bot',
  text: "Hi. Ask me anything about Ark's services, pricing, timelines, or the projects on this page.",
};

function generateSessionId() {
  return `ark-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatWidget({ compact = false }) {
  const [messages, setMessages] = useState([OPENING_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(true);
  const sessionId = useRef(generateSessionId());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Skip on initial render — only scroll within the widget after user interaction
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    setPillsVisible(false);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: text,
          sessionId: sessionId.current,
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      const reply = data.output || data.text || data.message || 'Sorry, I did not get a response.';

      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePill = (pill) => {
    sendMessage(pill);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) setPillsVisible(false);
  };

  return (
    <div className={`${styles.chatContainer} ${compact ? styles.chatCompact : ''}`}>
      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.msgUser : styles.msgBot}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className={`${styles.msgBot} ${styles.thinking}`}>
            Thinking…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preloaded pills */}
      <ChipGroup
        chips={PILLS}
        onSelect={handlePill}
        hidden={!pillsVisible}
        dark={compact}
        className={styles.pills}
      />

      {/* Input row */}
      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          className={styles.chatInput}
          disabled={loading}
          aria-label="Chat input"
        />
        <button
          className={styles.sendBtn}
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default function Demos() {
  return (
    <section className={styles.section} id="demos">
      <div className={`section-inner ${styles.inner}`}>
        {/* Header */}
        <div className={`reveal ${styles.header}`}>
          <p className={`mono-label ${styles.label}`}>Live Demos</p>
          <WordSplit text="See it working." className={styles.heading} />
          <p className={styles.sub}>
            Two working systems. Built on the same stack used for clients. Interact with them directly.
          </p>
        </div>

        {/* Demo 01 — Chatbot */}
        <div className={`demo-item reveal ${styles.demo}`}>
          <div className={styles.demoMeta}>
            <p className={styles.demoLabel}>DEMO // 01</p>
            <h3 className={styles.demoHeading}>Ask the chatbot</h3>
            <p className={styles.demoDesc}>
              Powered by a knowledge retrieval pipeline. Ask anything about services, pricing, timelines, or the projects on this page.
            </p>
            <p className={styles.demoTag}>Retrieval Pipeline · n8n · Pinecone</p>
          </div>

          <div className={styles.chatRight}>
            <div className={styles.chatLiveRow}>
              <span className={styles.chatLiveDot} aria-hidden="true" />
              <span className={styles.chatLiveLabel}>DEMO // 01 — Live</span>
            </div>
            <ChatWidget />
          </div>
        </div>

        {/* Divider */}
        <div className={styles.demoDivider} aria-hidden="true" />

        {/* Demo 02 — Lead Qualifier */}
        <div className={`demo-item reveal ${styles.demo}`}>
          <div className={styles.demoMeta}>
            <p className={styles.demoLabel}>DEMO // 02</p>
            <h3 className={styles.demoHeading}>Submit an inquiry</h3>
            <p className={styles.demoDesc}>
              An automated qualification system — your submission is scored and routed without any manual handling on my end.
            </p>
            <p className={styles.demoTag}>n8n · Claude API · Google Sheets</p>
          </div>

          <div className={styles.qualifierCard}>
            <p className={styles.qualifierDesc}>
              Fill the form and your inquiry is automatically scored by an intelligent model. Hot leads are flagged immediately. Everything else is routed and filed — no manual processing.
            </p>
            <p className={styles.qualifierStack}>n8n · Claude API · Vercel · Google Sheets</p>
            <a
              href="https://lead-qualifier-demo-sigma.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.qualifierLink}
            >
              Open Lead Qualifier →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
