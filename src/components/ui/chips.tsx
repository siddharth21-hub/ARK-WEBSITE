'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// Chip
// ─────────────────────────────────────────────

interface ChipProps {
  label: string
  onSelect: (label: string) => void
  dark?: boolean
  className?: string
}

export function Chip({ label, onSelect, dark = true, className }: ChipProps) {
  const borderColor = dark ? 'var(--accent-dim)' : 'rgba(17,17,8,0.15)'
  const textColor = dark ? 'rgba(245, 240, 232, 0.5)' : 'rgba(17,17,8,0.55)'
  const hoverBorder = dark ? 'var(--accent)' : 'rgba(17,17,8,0.4)'
  const hoverText = dark ? 'rgba(245, 240, 232, 0.8)' : 'rgba(17,17,8,0.85)'

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
      onClick={() => onSelect(label)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        fontWeight: 400,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        border: `1px solid ${borderColor}`,
        color: textColor,
        padding: '6px 12px',
        borderRadius: 0,
        background: 'none',
        cursor: 'pointer',
        whiteSpace: 'normal',
        maxWidth: '100%',
        transition: 'border-color 0.2s, color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorder
        e.currentTarget.style.color = hoverText
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor
        e.currentTarget.style.color = textColor
      }}
    >
      {label}
    </motion.button>
  )
}

// ─────────────────────────────────────────────
// ChipGroup
// ─────────────────────────────────────────────

interface ChipGroupProps {
  chips: string[]
  onSelect: (label: string) => void
  hidden?: boolean
  dark?: boolean
  className?: string
}

export function ChipGroup({ chips, onSelect, hidden = false, dark = true, className }: ChipGroupProps) {
  const [used, setUsed] = useState<Set<string>>(new Set())

  const remaining = chips.filter((c) => !used.has(c))
  const isVisible = !hidden && remaining.length > 0

  function handleSelect(label: string) {
    setUsed((prev) => new Set(prev).add(label))
    onSelect(label)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(className)}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {remaining.map((label) => (
              <Chip key={label} label={label} onSelect={handleSelect} dark={dark} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
