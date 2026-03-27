'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},
})

function useDialog() {
  return useContext(DialogContext)
}

// ─────────────────────────────────────────────
// Dialog (root)
// ─────────────────────────────────────────────

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value)
    onOpenChange?.(value)
  }

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

// ─────────────────────────────────────────────
// DialogTrigger
// ─────────────────────────────────────────────

interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export function DialogTrigger({ children, asChild, className }: DialogTriggerProps) {
  const { setOpen } = useDialog()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as any).props.onClick?.(e)
        setOpen(true)
      },
    })
  }

  return (
    <button type="button" className={cn(className)} onClick={() => setOpen(true)}>
      {children}
    </button>
  )
}

// ─────────────────────────────────────────────
// DialogContent
// ─────────────────────────────────────────────

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  maxWidth?: string
}

export function DialogContent({
  children,
  className,
  maxWidth = '520px',
}: DialogContentProps) {
  const { open, setOpen } = useDialog()
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, setOpen])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-modal-backdrop)' as any,
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className={cn(className)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-modal)' as any,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              style={{
                background: '#151210',
                border: '1px solid rgba(196, 168, 130, 0.2)',
                maxWidth,
                width: '100%',
                padding: 'clamp(32px, 4vw, 48px)',
                position: 'relative',
                pointerEvents: 'auto',
                borderRadius: 0,
              }}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────
// DialogHeader
// ─────────────────────────────────────────────

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(className)}
      style={{ marginBottom: '28px' }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// DialogTitle
// ─────────────────────────────────────────────

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(className)}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(20px, 2.5vw, 28px)',
        letterSpacing: '-0.02em',
        color: 'var(--text-warm)',
        lineHeight: 1.1,
      }}
    >
      {children}
    </h3>
  )
}

// ─────────────────────────────────────────────
// DialogClose
// ─────────────────────────────────────────────

export function DialogClose({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const { setOpen } = useDialog()

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={() => setOpen(false)}
      aria-label="Close dialog"
      style={{
        position: 'absolute',
        top: '16px',
        right: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '20px',
        fontWeight: 400,
        lineHeight: 1,
        color: 'rgba(245, 240, 232, 0.3)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-warm)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(245, 240, 232, 0.3)'
      }}
    >
      {children ?? '×'}
    </button>
  )
}
