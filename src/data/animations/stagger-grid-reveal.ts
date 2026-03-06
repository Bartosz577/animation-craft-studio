import type { AnimationEntry } from '@/lib/dictionary'

export const staggerGridReveal: AnimationEntry = {
  id: 'stagger-grid-reveal',
  name: { pl: 'Kaskada gridowa — elementy po kolei', en: 'Stagger Grid Reveal' },
  category: 'entrance',
  subcategory: 'grid',
  tags: ['grid', 'stagger', 'kaskada', 'fade', 'siatka', 'reveal'],
  description: {
    pl: 'Elementy gridu pojawiają się kaskadowo z opóźnieniem. Idealny do galerii, kart i portfolio.',
    en: 'Grid items reveal one by one with stagger delay, creating a cascade effect.',
    technical: 'Motion: variants with staggerChildren:0.08, children y:20→0 opacity:0→1',
  },
  preview: { component: 'StaggerGridReveal', thumbnail: '/thumbnails/stagger-grid-reveal.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
}

export function StaggerGridReveal({ items }: { items: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}
    >
      {items.map((child, i) => (
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

interface StaggerGridRevealProps {
  items: React.ReactNode[]
  className?: string
  columns?: number
  staggerDelay?: number
}

export function StaggerGridReveal({
  items,
  className,
  columns = 3,
  staggerDelay = 0.08,
}: StaggerGridRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay } },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      className={className}
      style={{ display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: '1rem' }}
    >
      {items.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { StaggerGridReveal } from '@/data/animations/stagger-grid-reveal'

const meta: Meta<typeof StaggerGridReveal> = {
  title: 'Animations/Entrance/StaggerGridReveal',
  component: StaggerGridReveal,
}

export default meta
type Story = StoryObj<typeof StaggerGridReveal>

export const Default: Story = {
  args: { items: Array.from({ length: 9 }, (_, i) => \`Card \${i + 1}\`) },
}`,
  },
  prompt: {
    fragment: 'Grid items cascade in with stagger',
    full_prompt: '[CONTEXT] Portfolio grid entrance [COMPONENT_SPEC] Staggered grid reveal [ANIMATION_TOKENS] element:grid trigger:onView type:fade direction:up stagger:true staggerDelay:0.08 easing:expo-out duration:medium library:motion style:minimal [VISUAL_REFERENCE] Cards appear one by one [CODE_CONSTRAINTS] Motion variants staggerChildren [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Even stagger timing, no overlap',
    frozen_hash: 'sgr-m3n4o5p6',
  },
  tokens: {
    element: 'grid',
    trigger: 'onView',
    type: 'fade',
    direction: 'up',
    stagger: true,
    staggerDelay: 0.08,
    easing: 'expo-out',
    duration: 'medium',
    library: 'motion',
    style: 'minimal',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['tilt-3d-card', 'glow-border', 'scale-in-center'],
    conflicts_with: ['slide-up-fade'],
  },
  examples: [
    { site: 'Lusion', url: 'https://lusion.co', screenshot: '/examples/lusion-grid.webp' },
  ],
}
