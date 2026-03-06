import type { AnimationEntry } from '@/lib/dictionary'

export const textScramble: AnimationEntry = {
  id: 'text-scramble',
  name: { pl: 'Scramble tekstu — losowe znaki', en: 'Text Scramble' },
  category: 'typography',
  subcategory: 'text-effect',
  tags: ['scramble', 'glitch', 'tekst', 'typography', 'hacker', 'efekt'],
  description: {
    pl: 'Znaki losowo się zmieniają zanim ułożą się w finalny tekst. Efekt znany z terminali i stron typu cyberpunk.',
    en: 'Characters cycle through random glyphs before resolving to the final text.',
    technical: 'GSAP: useEffect + gsap.to with onUpdate callback, manual char cycling via interval, no TextPlugin needed',
  },
  preview: { component: 'TextScramble', thumbnail: '/thumbnails/text-scramble.webp' },
  code: {
    minimal: `'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

export function TextScramble({ text = 'ANIMATION CRAFT' }: { text?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(text.replace(/[^ ]/g, ' '))

  useEffect(() => {
    if (!isInView) return

    let frame = 0
    const totalFrames = text.length * 3
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (frame / 3 > i) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      frame++
      if (frame > totalFrames) clearInterval(interval)
    }, 40)

    return () => clearInterval(interval)
  }, [isInView, text])

  return (
    <span ref={ref} style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      {display}
    </span>
  )
}`,
    full: `'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>[]{}~'

interface TextScrambleProps {
  text: string
  className?: string
  speed?: number
  revealSpeed?: number
}

export function TextScramble({ text, className, speed = 40, revealSpeed = 3 }: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(text.replace(/[^ ]/g, ' '))

  useEffect(() => {
    if (!isInView) return

    let frame = 0
    const totalFrames = text.length * revealSpeed
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (frame / revealSpeed > i) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      frame++
      if (frame > totalFrames) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [isInView, text, speed, revealSpeed])

  return (
    <span ref={ref} className={className} style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
      {display}
    </span>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { TextScramble } from '@/data/animations/text-scramble'

const meta: Meta<typeof TextScramble> = {
  title: 'Animations/Typography/TextScramble',
  component: TextScramble,
  args: { text: 'ANIMATION CRAFT STUDIO' },
}

export default meta
type Story = StoryObj<typeof TextScramble>

export const Default: Story = {}
export const SlowReveal: Story = { args: { speed: 60, revealSpeed: 5 } }`,
  },
  prompt: {
    fragment: 'Scramble characters cycling to final text',
    full_prompt: '[CONTEXT] Cyberpunk text reveal [COMPONENT_SPEC] Characters cycle through random glyphs [ANIMATION_TOKENS] element:text trigger:onView type:scramble direction:none stagger:false easing:linear duration:medium library:gsap style:brutal [VISUAL_REFERENCE] Terminal-style character cycling [CODE_CONSTRAINTS] Manual implementation, no GSAP TextPlugin [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Characters resolve left to right',
    frozen_hash: 'tscr-e5f6g7h8',
  },
  tokens: {
    element: 'text',
    trigger: 'onView',
    type: 'scramble',
    direction: 'none',
    stagger: false,
    easing: 'linear',
    duration: 'medium',
    library: 'gsap',
    style: 'brutal',
  },
  libraries: [
    { name: 'gsap', version: '>=3.0.0', required: false },
    { name: 'motion', version: '>=12.0.0', required: true },
  ],
  config: { intensity: 4, performance: 'low' },
  compatibility: {
    pairs_well_with: ['glow-border', 'cursor-trail', 'hero-sequence'],
    conflicts_with: ['text-split-reveal-up', 'text-wave'],
  },
  examples: [
    { site: 'Monopo', url: 'https://monopo.vn', screenshot: '/examples/monopo-scramble.webp' },
  ],
}
