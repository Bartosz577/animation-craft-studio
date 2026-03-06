import type { AnimationEntry } from '@/lib/dictionary'

export const scaleInCenter: AnimationEntry = {
  id: 'scale-in-center',
  name: { pl: 'Skalowanie z centrum', en: 'Scale In Center' },
  category: 'entrance',
  subcategory: 'scale',
  tags: ['scale', 'zoom', 'skalowanie', 'card', 'entrance', 'spring'],
  description: {
    pl: 'Element skaluje się od zera do pełnego rozmiaru z efektem sprężyny. Świetny do kart i modali.',
    en: 'Element scales from 0 to full size from center with spring physics.',
    technical: 'Motion: scale:0→1, spring transition with stiffness/damping, useInView trigger',
  },
  preview: { component: 'ScaleInCenter', thumbnail: '/thumbnails/scale-in-center.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function ScaleInCenter({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface ScaleInCenterProps {
  children: React.ReactNode
  className?: string
  stiffness?: number
  damping?: number
  delay?: number
}

export function ScaleInCenter({
  children,
  className,
  stiffness = 200,
  damping = 20,
  delay = 0,
}: ScaleInCenterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness, damping, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { ScaleInCenter } from '@/data/animations/scale-in-center'

const meta: Meta<typeof ScaleInCenter> = {
  title: 'Animations/Entrance/ScaleInCenter',
  component: ScaleInCenter,
}

export default meta
type Story = StoryObj<typeof ScaleInCenter>

export const Default: Story = {
  args: { children: 'Scale me in!' },
}`,
  },
  prompt: {
    fragment: 'Scale element from center with spring',
    full_prompt: '[CONTEXT] Card entrance [COMPONENT_SPEC] Scale from 0 to 1 with spring [ANIMATION_TOKENS] element:card trigger:onView type:scale direction:center stagger:false easing:spring duration:medium library:motion style:bold [VISUAL_REFERENCE] Element pops into existence [CODE_CONSTRAINTS] Motion spring transition [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Natural spring overshoot',
    frozen_hash: 'sic-e5f6g7h8',
  },
  tokens: {
    element: 'card',
    trigger: 'onView',
    type: 'scale',
    direction: 'center',
    stagger: false,
    easing: 'spring',
    duration: 'medium',
    library: 'motion',
    style: 'bold',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['slide-up-fade', 'text-blur-fade-in', 'glow-border'],
    conflicts_with: ['clip-reveal-horizontal'],
  },
  examples: [
    { site: 'Raycast', url: 'https://raycast.com', screenshot: '/examples/raycast-scale.webp' },
  ],
}
