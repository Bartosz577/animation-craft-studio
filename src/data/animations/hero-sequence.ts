import type { AnimationEntry } from '@/lib/dictionary'

export const heroSequence: AnimationEntry = {
  id: 'hero-sequence',
  name: { pl: 'Sekwencja hero — kaskada elementów', en: 'Hero Sequence' },
  category: 'entrance',
  subcategory: 'sequence',
  tags: ['hero', 'sekwencja', 'sequence', 'stagger', 'entrance', 'landing'],
  description: {
    pl: 'Sekwencja wejścia sekcji hero: tło, nagłówek, opis i przycisk pojawiają się po kolei. Klasyczny wzorzec dla landing page.',
    en: 'Hero section entrance sequence: background, heading, paragraph, and CTA appear in order.',
    technical: 'Motion: parent variants staggerChildren:0.2, children y:40→0 opacity:0→1, orchestrated sequence',
  },
  preview: { component: 'HeroSequence', thumbnail: '/thumbnails/hero-sequence.webp' },
  code: {
    minimal: `'use client'

import { motion } from 'motion/react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}

const item = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
  },
}

export function HeroSequence() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '4rem 2rem' }}
    >
      <motion.div
        variants={item}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #0f0f0f, #050505)',
          zIndex: -1,
        }}
      />
      <motion.h1 variants={item} style={{ fontSize: '3rem', fontWeight: 800 }}>
        Animation Craft Studio
      </motion.h1>
      <motion.p variants={item} style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '40ch' }}>
        Build award-level animated websites with AI-ready components.
      </motion.p>
      <motion.button
        variants={item}
        style={{
          padding: '0.75rem 2rem',
          background: '#a0ff60',
          color: '#050505',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          width: 'fit-content',
        }}
      >
        Get Started
      </motion.button>
    </motion.section>
  )
}`,
    full: `'use client'

import { motion, type Variants } from 'motion/react'

interface HeroSequenceProps {
  title: string
  subtitle: string
  cta: string
  className?: string
  staggerDelay?: number
  onCtaClick?: () => void
}

export function HeroSequence({
  title,
  subtitle,
  cta,
  className,
  staggerDelay = 0.2,
  onCtaClick,
}: HeroSequenceProps) {
  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay } },
  }

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.19, 1, 0.22, 1] } },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '4rem 2rem', position: 'relative' }}
    >
      <motion.div
        variants={itemVariants}
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0f0f0f, #050505)', zIndex: -1 }}
      />
      <motion.h1 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 800 }}>
        {title}
      </motion.h1>
      <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '40ch' }}>
        {subtitle}
      </motion.p>
      <motion.button
        variants={itemVariants}
        onClick={onCtaClick}
        style={{
          padding: '0.75rem 2rem',
          background: '#a0ff60',
          color: '#050505',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 700,
          cursor: 'pointer',
          width: 'fit-content',
        }}
      >
        {cta}
      </motion.button>
    </motion.section>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { HeroSequence } from '@/data/animations/hero-sequence'

const meta: Meta<typeof HeroSequence> = {
  title: 'Animations/Entrance/HeroSequence',
  component: HeroSequence,
}

export default meta
type Story = StoryObj<typeof HeroSequence>

export const Default: Story = {}`,
  },
  prompt: {
    fragment: 'Hero section staggered entrance sequence',
    full_prompt: '[CONTEXT] Landing page hero [COMPONENT_SPEC] Staggered sequence: bg → h1 → p → button [ANIMATION_TOKENS] element:hero trigger:onLoad type:fade direction:up stagger:true staggerDelay:0.2 easing:expo-out duration:slow library:motion style:editorial [VISUAL_REFERENCE] Elements cascade in top to bottom [CODE_CONSTRAINTS] Motion variants orchestration [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Correct order, 200ms between elements',
    frozen_hash: 'hs-q7r8s9t0',
  },
  tokens: {
    element: 'hero',
    trigger: 'onLoad',
    type: 'fade',
    direction: 'up',
    stagger: true,
    staggerDelay: 0.2,
    easing: 'expo-out',
    duration: 'slow',
    library: 'motion',
    style: 'editorial',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 4, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-split-reveal-up', 'text-blur-fade-in', 'parallax-image'],
    conflicts_with: ['slide-up-fade'],
  },
  examples: [
    { site: 'Awwwards', url: 'https://awwwards.com', screenshot: '/examples/awwwards-hero.webp' },
  ],
}
