import type { AnimationEntry } from '@/lib/dictionary'

export const textMagnetic: AnimationEntry = {
  id: 'text-magnetic',
  name: { pl: 'Tekst magnetyczny — podąża za kursorem', en: 'Text Magnetic' },
  category: 'typography',
  subcategory: 'interactive',
  tags: ['magnetic', 'hover', 'kursor', 'interaktywny', 'typography', 'spring'],
  description: {
    pl: 'Tekst przyciąga się do pozycji kursora z efektem sprężyny. Dodaje interaktywność do nagłówków i CTA.',
    en: 'Text follows cursor position with spring physics, creating a magnetic pull effect.',
    technical: 'Motion: useMotionValue for x/y, useSpring for damped following, onMouseMove/onMouseLeave handlers',
  },
  preview: { component: 'TextMagnetic', thumbnail: '/thumbnails/text-magnetic.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function TextMagnetic({ children = 'Hover Me' }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

interface TextMagneticProps {
  children: React.ReactNode
  className?: string
  strength?: number
  stiffness?: number
  damping?: number
}

export function TextMagnetic({
  children,
  className,
  strength = 1,
  stiffness = 150,
  damping = 15,
}: TextMagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
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
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={className}
      style={{ x: springX, y: springY, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { TextMagnetic } from '@/data/animations/text-magnetic'

const meta: Meta<typeof TextMagnetic> = {
  title: 'Animations/Typography/TextMagnetic',
  component: TextMagnetic,
  args: { children: 'Hover Over Me' },
}

export default meta
type Story = StoryObj<typeof TextMagnetic>

export const Default: Story = {}
export const StrongPull: Story = { args: { strength: 1.5 } }`,
  },
  prompt: {
    fragment: 'Text follows cursor with spring physics',
    full_prompt: '[CONTEXT] Interactive heading [COMPONENT_SPEC] Text magnetically follows cursor [ANIMATION_TOKENS] element:heading trigger:onHover type:magnetic direction:none stagger:false easing:spring duration:fast library:motion style:bold [VISUAL_REFERENCE] Element pulls toward cursor [CODE_CONSTRAINTS] useMotionValue + useSpring [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth spring return to center on mouse leave',
    frozen_hash: 'tmag-m3n4o5p6',
  },
  tokens: {
    element: 'heading',
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
    pairs_well_with: ['magnetic-button', 'tilt-3d-card', 'cursor-trail'],
    conflicts_with: ['text-wave'],
  },
  examples: [
    { site: 'Cuberto', url: 'https://cuberto.com', screenshot: '/examples/cuberto-magnetic.webp' },
  ],
}
