'use client'

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  dark: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SelectContext = createContext<SelectContextValue>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  dark: false,
  containerRef: { current: null },
})

function useSelectContext() {
  return useContext(SelectContext)
}

// ─────────────────────────────────────────────
// Select (root)
// ─────────────────────────────────────────────

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  dark?: boolean
  className?: string
}

export function Select({
  value,
  onValueChange,
  children,
  dark = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside the entire select component
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handler)
    }
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, dark, containerRef }}
    >
      <div
        ref={containerRef}
        className={cn(className)}
        style={{ position: 'relative' }}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ─────────────────────────────────────────────
// SelectTrigger
// ─────────────────────────────────────────────

interface SelectTriggerProps {
  placeholder?: string
  className?: string
}

export function SelectTrigger({ placeholder = 'Select…', className }: SelectTriggerProps) {
  const { value, open, setOpen, dark } = useSelectContext()

  const bg = dark ? 'rgba(245, 240, 232, 0.04)' : 'rgba(17, 17, 8, 0.04)'
  const borderColor = open
    ? 'rgba(196, 168, 130, 0.5)'
    : dark
    ? 'rgba(245, 240, 232, 0.08)'
    : 'rgba(17, 17, 8, 0.1)'
  const textColor = value
    ? dark
      ? 'var(--text-warm)'
      : 'var(--text-dark)'
    : dark
    ? 'rgba(245, 240, 232, 0.25)'
    : 'rgba(17, 17, 8, 0.3)'
  const chevronColor = dark
    ? 'rgba(245, 240, 232, 0.3)'
    : 'rgba(17, 17, 8, 0.3)'

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-haspopup="listbox"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 0,
        padding: '14px 16px',
        fontFamily: 'var(--font-body)',
        fontWeight: 400,
        fontSize: '15px',
        color: textColor,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.25s',
        outline: 'none',
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value || placeholder}
      </span>
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexShrink: 0, color: chevronColor }}
      >
        <ChevronDown size={14} strokeWidth={1.5} />
      </motion.span>
    </button>
  )
}

// ─────────────────────────────────────────────
// SelectContent
// ─────────────────────────────────────────────

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open, dark, containerRef } = useSelectContext()
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    if (open && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setRect({ top: r.bottom + 4, left: r.left, width: r.width })
    }
  }, [open, containerRef])

  const bg = dark ? '#1A1714' : '#FFFFFF'
  const border = dark
    ? '1px solid rgba(245, 240, 232, 0.08)'
    : '1px solid rgba(17, 17, 8, 0.12)'
  const shadow = dark
    ? '0 8px 32px rgba(0,0,0,0.5)'
    : '0 8px 32px rgba(17,17,8,0.12)'

  if (!rect) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="listbox"
          className={cn(className)}
          initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            background: bg,
            border,
            borderRadius: 0,
            zIndex: 9999,
            maxHeight: '280px',
            overflowY: 'auto',
            boxShadow: shadow,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ─────────────────────────────────────────────
// SelectItem
// ─────────────────────────────────────────────

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen, dark } = useSelectContext()
  const isSelected = selectedValue === value

  const baseColor = dark
    ? isSelected
      ? 'var(--accent)'
      : 'rgba(245, 240, 232, 0.7)'
    : isSelected
    ? 'var(--accent)'
    : 'rgba(17, 17, 8, 0.7)'

  const dividerColor = dark
    ? 'rgba(245, 240, 232, 0.04)'
    : 'rgba(17, 17, 8, 0.05)'

  return (
    <button
      role="option"
      aria-selected={isSelected}
      type="button"
      className={cn(className)}
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '12px 16px',
        fontFamily: 'var(--font-body)',
        fontWeight: isSelected ? 400 : 300,
        fontSize: '14px',
        color: baseColor,
        background: 'none',
        border: 'none',
        borderBottom: `1px solid ${dividerColor}`,
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = dark
          ? 'rgba(196, 168, 130, 0.08)'
          : 'rgba(17, 17, 8, 0.04)'
        if (!isSelected) e.currentTarget.style.color = 'var(--accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'none'
        e.currentTarget.style.color = baseColor
      }}
    >
      {children}
    </button>
  )
}
