'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { AnimationEntry } from '@/lib/dictionary'
import { getCategoryColor } from '@/lib/dictionary'

interface AnimationDetailModalProps {
  entry: AnimationEntry | null
  onClose: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="rounded px-2 py-1 text-xs font-medium transition-colors"
      style={{
        background: copied ? '#a0ff6030' : 'var(--color-surface-elevated)',
        color: copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      }}
    >
      {copied ? 'Skopiowano!' : 'Kopiuj'}
    </button>
  )
}

function TokenChip({ label, value }: { label: string; value: string | number | boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{ background: 'var(--color-surface-elevated)' }}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}:</span>
      <span style={{ color: 'var(--color-accent)' }}>{String(value)}</span>
    </span>
  )
}

function IdBadge({ id, variant = 'green' }: { id: string; variant?: 'green' | 'red' }) {
  const colors = variant === 'green'
    ? { bg: '#a0ff6018', color: '#a0ff60' }
    : { bg: '#f8717118', color: '#f87171' }

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: colors.bg, color: colors.color }}
    >
      {id}
    </span>
  )
}

export function AnimationDetailModal({ entry, onClose }: AnimationDetailModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto"
            style={{ background: 'var(--color-surface)' }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between border-b p-6"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
                >
                  {entry.name.en}
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {entry.name.pl}
                </p>
                <span
                  className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: getCategoryColor(entry.category) + '18',
                    color: getCategoryColor(entry.category),
                  }}
                >
                  {entry.category}
                </span>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                &times;
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Designer description */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                  Dla designera
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                  {entry.description.pl}
                </p>
              </section>

              {/* Technical */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                  Technical
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}
                >
                  {entry.description.technical}
                </p>
              </section>

              {/* Animation Tokens */}
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                  Tokeny animacji
                </h3>
                <div className="flex flex-wrap gap-2">
                  <TokenChip label="element" value={entry.tokens.element} />
                  <TokenChip label="trigger" value={entry.tokens.trigger} />
                  <TokenChip label="type" value={entry.tokens.type} />
                  <TokenChip label="direction" value={entry.tokens.direction} />
                  <TokenChip label="stagger" value={entry.tokens.stagger} />
                  {entry.tokens.staggerDelay !== undefined && (
                    <TokenChip label="staggerDelay" value={entry.tokens.staggerDelay} />
                  )}
                  <TokenChip label="easing" value={entry.tokens.easing} />
                  <TokenChip label="duration" value={entry.tokens.duration} />
                  <TokenChip label="library" value={entry.tokens.library} />
                  <TokenChip label="style" value={entry.tokens.style} />
                </div>
              </section>

              {/* Code */}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Kod
                  </h3>
                  <CopyButton text={entry.code.minimal} />
                </div>
                <pre
                  className="overflow-x-auto rounded-lg p-4 text-xs leading-relaxed"
                  style={{
                    background: 'var(--color-background)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <code>{entry.code.minimal}</code>
                </pre>
              </section>

              {/* Prompt fragment */}
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Prompt fragment
                  </h3>
                  <CopyButton text={entry.prompt.full_prompt} />
                </div>
                <pre
                  className="overflow-x-auto whitespace-pre-wrap rounded-lg p-4 text-xs leading-relaxed"
                  style={{
                    background: 'var(--color-background)',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <code>{entry.prompt.full_prompt}</code>
                </pre>
              </section>

              {/* Compatibility */}
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                  Kompatybilność
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="mb-1.5 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      Pasuje do:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.compatibility.pairs_well_with.map((id) => (
                        <IdBadge key={id} id={id} variant="green" />
                      ))}
                    </div>
                  </div>
                  {entry.compatibility.conflicts_with.length > 0 && (
                    <div>
                      <span className="mb-1.5 block text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        Konflikty z:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.compatibility.conflicts_with.map((id) => (
                          <IdBadge key={id} id={id} variant="red" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
