import type { AnimationEntry } from '@/lib/dictionary'

export const magneticButton: AnimationEntry = {
  id: 'magnetic-button',
  name: { pl: 'Przycisk magnetyczny', en: 'Magnetic Button' },
  category: 'hover',
  subcategory: 'magnetic',
  tags: ['magnetic', 'button', 'przycisk', 'hover', 'spring', 'interaktywny'],
  description: {
    pl: 'Przycisk podąża za kursorem z efektem magnetycznego przyciągania. Popularny na stronach portfolio i agencji kreatywnych.',
    en: 'Button follows cursor within its bounds with spring physics on hover.',
    technical: 'Motion: useMotionValue x/y, useSpring, onMouseMove offset calc, motion.button',
  },
  preview: { component: 'MagneticButton', thumbnail: '/thumbnails/magnetic-button.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function MagneticButton({ children = 'Hover Me' }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{
        x: springX,
        y: springY,
        padding: '0.75rem 2rem',
        background: '#a0ff60',
        color: '#050505',
        border: 'none',
        borderRadius: '0.5rem',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      {children}
    </motion.button>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  stiffness?: number
  damping?: number
  onClick?: () => void
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  stiffness = 150,
  damping = 15,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness, damping })
  const springY = useSpring(y, { stiffness, damping })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.button>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { MagneticButton } from '@/data/animations/magnetic-button'

const meta: Meta<typeof MagneticButton> = {
  title: 'Animations/Hover/MagneticButton',
  component: MagneticButton,
  args: { children: 'Hover Me' },
}

export default meta
type Story = StoryObj<typeof MagneticButton>

export const Default: Story = {}
export const StrongPull: Story = { args: { strength: 0.6, children: 'Strong Magnet' } }`,
  },
  prompt: {
    fragment: 'Button follows cursor with spring magnetic effect',
    full_prompt: '[CONTEXT] CTA button interaction [COMPONENT_SPEC] Magnetic cursor following [ANIMATION_TOKENS] element:button trigger:onHover type:magnetic direction:none stagger:false easing:spring duration:fast library:motion style:bold [VISUAL_REFERENCE] Button subtly pulls toward cursor [CODE_CONSTRAINTS] useMotionValue + useSpring [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth spring, returns to center on leave',
    frozen_hash: 'mb-o1p2q3r4',
  },
  tokens: {
    element: 'button',
    trigger: 'onHover',
    type: 'magnetic',
    direction: 'none',
    stagger: false,
    easing: 'spring',
    duration: 'fast',
    library: 'motion',
    style: 'bold',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-magnetic', 'tilt-3d-card', 'cursor-trail'],
    conflicts_with: ['liquid-hover'],
  },
  examples: [
    { site: 'Cuberto', url: 'https://cuberto.com', screenshot: '/examples/cuberto-magnetic-btn.webp' },
  ],
}
