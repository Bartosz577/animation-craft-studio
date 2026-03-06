import type { AnimationEntry } from '@/lib/dictionary'

export const slideUpFade: AnimationEntry = {
  id: 'slide-up-fade',
  name: { pl: 'Wjazd w górę z fade', en: 'Slide Up Fade' },
  category: 'entrance',
  subcategory: 'slide',
  tags: ['slide', 'fade', 'wjazd', 'entrance', 'stagger', 'sekcja'],
  description: {
    pl: 'Elementy wjeżdżają od dołu z przezroczystością. Najczęstszy efekt wejścia — uniwersalny i elegancki.',
    en: 'Elements slide up from below with opacity fade, staggered for groups.',
    technical: 'Motion: useInView, variants with staggerChildren, y:30→0 opacity:0→1',
  },
  preview: { component: 'SlideUpFade', thumbnail: '/thumbnails/slide-up-fade.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
}

export function SlideUpFade({ children }: { children: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'motion/react'

interface SlideUpFadeProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
  offset?: number
  duration?: number
}

export function SlideUpFade({
  children,
  className,
  staggerDelay = 0.1,
  offset = 30,
  duration = 0.6,
}: SlideUpFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay } },
  }

  const itemVariants: Variants = {
    hidden: { y: offset, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration, ease: [0.19, 1, 0.22, 1] } },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { SlideUpFade } from '@/data/animations/slide-up-fade'

const meta: Meta<typeof SlideUpFade> = {
  title: 'Animations/Entrance/SlideUpFade',
  component: SlideUpFade,
}

export default meta
type Story = StoryObj<typeof SlideUpFade>

export const Default: Story = {
  args: { children: ['Item 1', 'Item 2', 'Item 3'] },
}`,
  },
  prompt: {
    fragment: 'Slide children up with stagger fade',
    full_prompt: '[CONTEXT] Section entrance animation [COMPONENT_SPEC] Staggered slide up with fade [ANIMATION_TOKENS] element:section trigger:onView type:slide direction:up stagger:true staggerDelay:0.1 easing:expo-out duration:medium library:motion style:minimal [VISUAL_REFERENCE] Elements cascade upward [CODE_CONSTRAINTS] Motion variants, useInView [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth stagger, no layout shift',
    frozen_hash: 'suf-a1b2c3d4',
  },
  tokens: {
    element: 'section',
    trigger: 'onView',
    type: 'slide',
    direction: 'up',
    stagger: true,
    staggerDelay: 0.1,
    easing: 'expo-out',
    duration: 'medium',
    library: 'motion',
    style: 'minimal',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-split-reveal-up', 'text-blur-fade-in', 'hero-sequence'],
    conflicts_with: ['stagger-grid-reveal'],
  },
  examples: [
    { site: 'Vercel', url: 'https://vercel.com', screenshot: '/examples/vercel-slide.webp' },
  ],
}
