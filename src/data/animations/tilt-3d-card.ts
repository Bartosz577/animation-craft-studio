import type { AnimationEntry } from '@/lib/dictionary'

export const tilt3dCard: AnimationEntry = {
  id: 'tilt-3d-card',
  name: { pl: 'Karta 3D z przechyleniem', en: 'Tilt 3D Card' },
  category: 'hover',
  subcategory: '3d-transform',
  tags: ['tilt', '3d', 'karta', 'hover', 'perspective', 'rotacja'],
  description: {
    pl: 'Karta przechyla się w 3D podążając za pozycją kursora. Efekt premium znany z Apple i stron luksusowych marek.',
    en: 'Card tilts in 3D space following cursor position with perspective transform.',
    technical: 'Motion: useMotionValue rotateX/rotateY, useSpring, perspective(1000px), onMouseMove calc',
  },
  preview: { component: 'Tilt3dCard', thumbnail: '/thumbnails/tilt-3d-card.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function Tilt3dCard({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(yPct * -20)
    rotateY.set(xPct * 20)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        width: 300,
        height: 200,
        background: '#1a1a1a',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #2a2a2a',
      }}
    >
      {children ?? <span style={{ color: '#f0f0f0' }}>Hover to tilt</span>}
    </motion.div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

interface Tilt3dCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  perspective?: number
  stiffness?: number
  damping?: number
}

export function Tilt3dCard({
  children,
  className,
  maxTilt = 20,
  perspective = 1000,
  stiffness = 200,
  damping = 20,
}: Tilt3dCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness, damping })
  const springRotateY = useSpring(rotateY, { stiffness, damping })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(yPct * -maxTilt)
    rotateY.set(xPct * maxTilt)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: perspective }}
    >
      {children}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { Tilt3dCard } from '@/data/animations/tilt-3d-card'

const meta: Meta<typeof Tilt3dCard> = {
  title: 'Animations/Hover/Tilt3dCard',
  component: Tilt3dCard,
  args: { children: 'Tilt me!' },
}

export default meta
type Story = StoryObj<typeof Tilt3dCard>

export const Default: Story = {}
export const ExtremeTilt: Story = { args: { maxTilt: 40 } }`,
  },
  prompt: {
    fragment: 'Card tilts in 3D following cursor position',
    full_prompt: '[CONTEXT] Premium card interaction [COMPONENT_SPEC] 3D tilt with perspective [ANIMATION_TOKENS] element:card trigger:onHover type:3d direction:none stagger:false easing:spring duration:fast library:motion style:luxury [VISUAL_REFERENCE] Card rotates like held in hand [CODE_CONSTRAINTS] useMotionValue rotateX/Y, useSpring [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth tilt, proper perspective, resets on leave',
    frozen_hash: 't3c-s5t6u7v8',
  },
  tokens: {
    element: 'card',
    trigger: 'onHover',
    type: '3d',
    direction: 'none',
    stagger: false,
    easing: 'spring',
    duration: 'fast',
    library: 'motion',
    style: 'luxury',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'low' },
  compatibility: {
    pairs_well_with: ['glow-border', 'stagger-grid-reveal', 'magnetic-button'],
    conflicts_with: ['liquid-hover'],
  },
  examples: [
    { site: 'Stripe', url: 'https://stripe.com/payments', screenshot: '/examples/stripe-tilt.webp' },
  ],
}
