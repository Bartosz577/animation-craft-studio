'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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

// ---------------------------------------------------------------------------
// Scramble preview helper
// ---------------------------------------------------------------------------
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

function ScramblePreview({ hovered }: { hovered: boolean }) {
  const target = 'HELLO'
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!hovered) {
      setDisplay(target)
      return
    }
    let iteration = 0
    const iv = setInterval(() => {
      setDisplay(
        target
          .split('')
          .map((ch, i) =>
            i < iteration ? ch : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join(''),
      )
      iteration += 0.5
      if (iteration >= target.length) clearInterval(iv)
    }, 40)
    return () => clearInterval(iv)
  }, [hovered])

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: '#a0ff60', letterSpacing: '0.15em' }}>
      {display}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Per-type preview content
// ---------------------------------------------------------------------------

function getPreviewContent(entry: AnimationEntry, hovered: boolean) {
  const catColor = getCategoryColor(entry.category)
  const type = entry.tokens.type
  const dir = entry.tokens.direction

  switch (type) {
    case 'split':
      return (
        <div style={{ display: 'flex', gap: 2 }}>
          {'Aa Bb'.split('').map((ch, i) => (
            <motion.span
              key={i}
              animate={hovered ? { y: 0, opacity: 1 } : { y: 12, opacity: 0.3 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{ display: 'inline-block', fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0' }}
            >
              {ch === ' ' ? '\u00a0' : ch}
            </motion.span>
          ))}
        </div>
      )

    case 'fade':
      return (
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.15 }}
          transition={{ duration: 0.4 }}
          style={{ width: 64, height: 64, borderRadius: 12, background: catColor }}
        />
      )

    case 'slide': {
      const x = dir === 'left' ? -40 : dir === 'right' ? 40 : 0
      const y = dir === 'up' ? -40 : dir === 'down' ? 40 : 0
      return (
        <motion.div
          animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x, y, opacity: 0.3 }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          style={{ width: 56, height: 56, borderRadius: 10, background: catColor }}
        />
      )
    }

    case 'scale':
      return (
        <motion.div
          animate={{ scale: hovered ? 1 : 0.5, opacity: hovered ? 1 : 0.4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ width: 60, height: 60, borderRadius: 14, background: catColor }}
        />
      )

    case 'clip':
      return (
        <motion.span
          animate={{ clipPath: hovered ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f0f0', display: 'inline-block' }}
        >
          REVEAL
        </motion.span>
      )

    case 'scramble':
      return <ScramblePreview hovered={hovered} />

    case 'wave':
      return (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              animate={hovered ? { y: [0, -10, 0] } : { y: 0 }}
              transition={hovered ? { delay: i * 0.1, duration: 0.5, repeat: Infinity, repeatDelay: 0.3 } : {}}
              style={{ width: 8, height: 8, borderRadius: '50%', background: catColor }}
            />
          ))}
        </div>
      )

    case 'magnetic':
      return (
        <motion.div
          animate={hovered ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          style={{ width: 50, height: 50, borderRadius: '50%', background: catColor, cursor: 'pointer' }}
        />
      )

    case 'particle':
      return (
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const r = hovered ? 35 : 8
            return (
              <motion.div
                key={i}
                animate={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r, opacity: hovered ? 0.8 : 0.3 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: catColor,
                  marginLeft: -3,
                  marginTop: -3,
                }}
              />
            )
          })}
        </div>
      )

    case 'glitch':
      return (
        <div style={{ position: 'relative', fontSize: '1.25rem', fontWeight: 700 }}>
          <span style={{ color: '#f0f0f0' }}>GLITCH</span>
          {hovered && (
            <>
              <motion.span
                animate={{ x: [2, -2, 1, -1, 2], opacity: [0.7, 0.5, 0.7] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                style={{ position: 'absolute', left: 0, top: 0, color: 'rgba(255,0,0,0.7)', clipPath: 'inset(20% 0 40% 0)' }}
              >
                GLITCH
              </motion.span>
              <motion.span
                animate={{ x: [-2, 2, -1, 1, -2], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                style={{ position: 'absolute', left: 0, top: 0, color: 'rgba(0,0,255,0.7)', clipPath: 'inset(50% 0 10% 0)' }}
              >
                GLITCH
              </motion.span>
            </>
          )}
        </div>
      )

    case '3d':
      return (
        <motion.div
          animate={hovered ? { rotateY: 15, rotateX: -10 } : { rotateY: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: catColor + '30',
            border: `1px solid ${catColor}60`,
            transformPerspective: 600,
          }}
        />
      )

    case 'rotate':
      return (
        <motion.div
          animate={hovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          style={{ width: 48, height: 48, borderRadius: 8, background: catColor }}
        />
      )

    case 'morph':
      return (
        <svg width="60" height="60" viewBox="0 0 60 60">
          <motion.rect
            x="5"
            y="5"
            width="50"
            height="50"
            fill={catColor}
            animate={hovered ? { rx: 25, ry: 25 } : { rx: 4, ry: 4 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>
      )

    case 'blur':
      return (
        <motion.span
          animate={{ filter: hovered ? 'blur(0px)' : 'blur(6px)', opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f0f0f0' }}
        >
          SHARP
        </motion.span>
      )

    default:
      return (
        <motion.span
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '0.875rem', fontWeight: 600, color: catColor }}
        >
          {entry.name.en}
        </motion.span>
      )
  }
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface AnimationCardProps {
  entry: AnimationEntry
  onClick: (entry: AnimationEntry) => void
}

export function AnimationCard({ entry, onClick }: AnimationCardProps) {
  const catColor = getCategoryColor(entry.category)
  const perf = perfDot[entry.config.performance]
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ borderColor: 'var(--color-accent)' }}
      onClick={() => onClick(entry)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        {getPreviewContent(entry, hovered)}
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
