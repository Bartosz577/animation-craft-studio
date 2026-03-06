'use client'

import { motion } from 'motion/react'
import type { AnimationEntry, AnimationLibrary, PerformanceCost } from '@/lib/dictionary'
import { getCategoryColor } from '@/lib/dictionary'

const libraryColors: Record<AnimationLibrary, string> = {
  motion: '#a0ff60',
  gsap: '#fb923c',
  r3f: '#818cf8',
  css: '#888888',
  lenis: '#34d399',
}

const perfDot: Record<PerformanceCost, { color: string; label?: string }> = {
  low: { color: '#34d399' },
  medium: { color: '#fbbf24' },
  high: { color: '#fb923c' },
  webgl: { color: '#a78bfa', label: 'WebGL' },
}

interface AnimationCardProps {
  entry: AnimationEntry
  onClick: (entry: AnimationEntry) => void
}

export function AnimationCard({ entry, onClick }: AnimationCardProps) {
  const catColor = getCategoryColor(entry.category)
  const perf = perfDot[entry.config.performance]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ borderColor: 'var(--color-accent)' }}
      onClick={() => onClick(entry)}
      className="cursor-pointer overflow-hidden rounded-xl border"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Preview area */}
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden"
        style={{ background: 'var(--color-background)' }}
      >
        <motion.div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 80,
            height: 80,
            background: catColor + '18',
            border: `1px solid ${catColor}40`,
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: catColor }}
          >
            {entry.tokens.type}
          </span>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="text-sm font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {entry.name.en}
        </h3>
        <span
          className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: catColor + '18',
            color: catColor,
          }}
        >
          {entry.category}
        </span>
      </div>

      {/* Footer */}
      <div
        className="flex items-center gap-2 border-t px-4 py-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {entry.libraries.map((lib) => (
            <span
              key={lib.name}
              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                background: libraryColors[lib.name] + '18',
                color: libraryColors[lib.name],
              }}
            >
              {lib.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: perf.color }}
          />
          {perf.label && (
            <span className="text-[10px]" style={{ color: perf.color }}>
              {perf.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
