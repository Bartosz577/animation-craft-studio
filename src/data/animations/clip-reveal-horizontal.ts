import type { AnimationEntry } from '@/lib/dictionary'

export const clipRevealHorizontal: AnimationEntry = {
  id: 'clip-reveal-horizontal',
  name: { pl: 'Odsłonięcie clip-path z lewej', en: 'Clip Reveal Horizontal' },
  category: 'entrance',
  subcategory: 'clip',
  tags: ['clip', 'reveal', 'odsłonięcie', 'image', 'editorial', 'mask'],
  description: {
    pl: 'Element odsłania się horyzontalnie przez animację clip-path. Doskonały do zdjęć i sekcji editorial.',
    en: 'Element reveals horizontally via clipPath animation from left to right.',
    technical: 'Motion: clipPath inset(0 100% 0 0) → inset(0 0% 0 0), expo-out easing',
  },
  preview: { component: 'ClipRevealHorizontal', thumbnail: '/thumbnails/clip-reveal-horizontal.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function ClipRevealHorizontal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface ClipRevealHorizontalProps {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right'
  duration?: number
  delay?: number
}

export function ClipRevealHorizontal({
  children,
  className,
  direction = 'left',
  duration = 1,
  delay = 0,
}: ClipRevealHorizontalProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const hidden = direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
  const visible = 'inset(0 0% 0 0)'

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: hidden }}
      animate={isInView ? { clipPath: visible } : { clipPath: hidden }}
      transition={{ duration, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { ClipRevealHorizontal } from '@/data/animations/clip-reveal-horizontal'

const meta: Meta<typeof ClipRevealHorizontal> = {
  title: 'Animations/Entrance/ClipRevealHorizontal',
  component: ClipRevealHorizontal,
}

export default meta
type Story = StoryObj<typeof ClipRevealHorizontal>

export const Default: Story = {
  args: { children: 'Revealed content' },
}`,
  },
  prompt: {
    fragment: 'Reveal element via horizontal clipPath animation',
    full_prompt: '[CONTEXT] Image reveal animation [COMPONENT_SPEC] Horizontal clip-path reveal [ANIMATION_TOKENS] element:image trigger:onView type:clip direction:left stagger:false easing:expo-out duration:slow library:motion style:editorial [VISUAL_REFERENCE] Curtain reveals from left [CODE_CONSTRAINTS] Motion clipPath animate [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Clean edge, no content flash',
    frozen_hash: 'crh-i9j0k1l2',
  },
  tokens: {
    element: 'image',
    trigger: 'onView',
    type: 'clip',
    direction: 'left',
    stagger: false,
    easing: 'expo-out',
    duration: 'slow',
    library: 'motion',
    style: 'editorial',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-split-reveal-up', 'parallax-image', 'hero-sequence'],
    conflicts_with: ['scale-in-center'],
  },
  examples: [
    { site: 'Aristide Benoist', url: 'https://aristidebenoist.com', screenshot: '/examples/aristide-clip.webp' },
  ],
}
