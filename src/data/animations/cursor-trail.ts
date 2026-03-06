import type { AnimationEntry } from '@/lib/dictionary'

export const cursorTrail: AnimationEntry = {
  id: 'cursor-trail',
  name: { pl: 'Ślad kursora — trail particles', en: 'Cursor Trail' },
  category: 'hover',
  subcategory: 'particle',
  tags: ['cursor', 'trail', 'ślad', 'particle', 'hover', 'playful'],
  description: {
    pl: 'Za kursorem podąża seria zanikających kropek tworzących ślad. Efekt dekoracyjny dodający dynamiki do sekcji.',
    en: 'Series of fading dots follow cursor movement, creating a particle trail effect.',
    technical: 'Motion: onMouseMove tracks position, AnimatePresence renders trail dots, scale+opacity exit',
  },
  preview: { component: 'CursorTrail', thumbnail: '/thumbnails/cursor-trail.webp' },
  code: {
    minimal: `'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface TrailDot {
  id: number
  x: number
  y: number
}

let nextId = 0

export function CursorTrail({ children }: { children?: React.ReactNode }) {
  const [trail, setTrail] = useState<TrailDot[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dot: TrailDot = {
      id: nextId++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setTrail((prev) => [...prev.slice(-12), dot])
    setTimeout(() => {
      setTrail((prev) => prev.filter((d) => d.id !== dot.id))
    }, 500)
  }, [])

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}
    >
      {children}
      <AnimatePresence>
        {trail.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: dot.x - 6,
              top: dot.y - 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#a0ff60',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}`,
    full: `'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface TrailDot {
  id: number
  x: number
  y: number
}

interface CursorTrailProps {
  children?: React.ReactNode
  className?: string
  dotColor?: string
  dotSize?: number
  trailLength?: number
  fadeTime?: number
}

let nextId = 0

export function CursorTrail({
  children,
  className,
  dotColor = '#a0ff60',
  dotSize = 12,
  trailLength = 12,
  fadeTime = 500,
}: CursorTrailProps) {
  const [trail, setTrail] = useState<TrailDot[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dot: TrailDot = {
      id: nextId++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    setTrail((prev) => [...prev.slice(-trailLength), dot])
    setTimeout(() => {
      setTrail((prev) => prev.filter((d) => d.id !== dot.id))
    }, fadeTime)
  }, [trailLength, fadeTime])

  return (
    <div onMouseMove={handleMouseMove} className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      <AnimatePresence>
        {trail.map((dot) => (
          <motion.div
            key={dot.id}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0.6 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: fadeTime / 1000, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: dot.x - dotSize / 2,
              top: dot.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: dotColor,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { CursorTrail } from '@/data/animations/cursor-trail'

const meta: Meta<typeof CursorTrail> = {
  title: 'Animations/Hover/CursorTrail',
  component: CursorTrail,
}

export default meta
type Story = StoryObj<typeof CursorTrail>

export const Default: Story = {
  args: { children: 'Move your mouse here' },
}`,
  },
  prompt: {
    fragment: 'Fading dots follow cursor creating particle trail',
    full_prompt: '[CONTEXT] Decorative section interaction [COMPONENT_SPEC] Trail of fading dots following cursor [ANIMATION_TOKENS] element:section trigger:onHover type:particle direction:none stagger:true staggerDelay:0.05 easing:ease-out duration:fast library:motion style:playful [VISUAL_REFERENCE] Sparkle trail behind cursor [CODE_CONSTRAINTS] AnimatePresence, motion.div exit [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] No memory leak, dots clean up',
    frozen_hash: 'ct-e7f8g9h0',
  },
  tokens: {
    element: 'section',
    trigger: 'onHover',
    type: 'particle',
    direction: 'none',
    stagger: true,
    staggerDelay: 0.05,
    easing: 'ease-out',
    duration: 'fast',
    library: 'motion',
    style: 'playful',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'medium' },
  compatibility: {
    pairs_well_with: ['text-wave', 'liquid-hover', 'text-magnetic'],
    conflicts_with: ['glow-border'],
  },
  examples: [
    { site: 'Codrops', url: 'https://tympanus.net/codrops', screenshot: '/examples/codrops-trail.webp' },
  ],
}
