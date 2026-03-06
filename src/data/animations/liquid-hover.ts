import type { AnimationEntry } from '@/lib/dictionary'

export const liquidHover: AnimationEntry = {
  id: 'liquid-hover',
  name: { pl: 'Efekt cieczy na hoverze', en: 'Liquid Hover' },
  category: 'hover',
  subcategory: 'fill',
  tags: ['liquid', 'hover', 'ciecz', 'fill', 'button', 'clipPath'],
  description: {
    pl: 'Kolor wypełnienia podnosi się jak ciecz od dołu przycisku na hover. Efekt playful, idealny do CTA.',
    en: 'Fill color rises from bottom like liquid using clipPath circle expansion on hover.',
    technical: 'Motion: inner div with clipPath circle(), animate from 0% to 150% radius, position:absolute overlay',
  },
  preview: { component: 'LiquidHover', thumbnail: '/thumbnails/liquid-hover.webp' },
  code: {
    minimal: `'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

export function LiquidHover({ children = 'Hover Me' }: { children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0.75rem 2rem',
        background: 'transparent',
        border: '2px solid #a0ff60',
        borderRadius: '0.5rem',
        color: hovered ? '#050505' : '#a0ff60',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 100%)' }}
        animate={{ clipPath: hovered ? 'circle(150% at 50% 100%)' : 'circle(0% at 50% 100%)' }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#a0ff60',
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  )
}`,
    full: `'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

interface LiquidHoverProps {
  children: React.ReactNode
  className?: string
  fillColor?: string
  borderColor?: string
  onClick?: () => void
}

export function LiquidHover({
  children,
  className,
  fillColor = '#a0ff60',
  borderColor = '#a0ff60',
  onClick,
}: LiquidHoverProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0.75rem 2rem',
        background: 'transparent',
        border: \`2px solid \${borderColor}\`,
        borderRadius: '0.5rem',
        color: hovered ? '#050505' : borderColor,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 100%)' }}
        animate={{ clipPath: hovered ? 'circle(150% at 50% 100%)' : 'circle(0% at 50% 100%)' }}
        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', inset: 0, background: fillColor, zIndex: 0 }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.button>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { LiquidHover } from '@/data/animations/liquid-hover'

const meta: Meta<typeof LiquidHover> = {
  title: 'Animations/Hover/LiquidHover',
  component: LiquidHover,
  args: { children: 'Hover Me' },
}

export default meta
type Story = StoryObj<typeof LiquidHover>

export const Default: Story = {}
export const CustomColor: Story = { args: { fillColor: '#ff6060', borderColor: '#ff6060' } }`,
  },
  prompt: {
    fragment: 'Liquid fill rises from bottom on hover via clipPath',
    full_prompt: '[CONTEXT] CTA button hover [COMPONENT_SPEC] Circle clipPath expands from bottom [ANIMATION_TOKENS] element:button trigger:onHover type:clip direction:up stagger:false easing:ease-in-out duration:fast library:motion style:playful [VISUAL_REFERENCE] Color fills up like water [CODE_CONSTRAINTS] Motion animate clipPath circle [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth circle expansion, text stays visible',
    frozen_hash: 'lh-w9x0y1z2',
  },
  tokens: {
    element: 'button',
    trigger: 'onHover',
    type: 'clip',
    direction: 'up',
    stagger: false,
    easing: 'ease-in-out',
    duration: 'fast',
    library: 'motion',
    style: 'playful',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-wave', 'cursor-trail', 'hero-sequence'],
    conflicts_with: ['magnetic-button', 'tilt-3d-card'],
  },
  examples: [
    { site: 'Resn', url: 'https://resn.co.nz', screenshot: '/examples/resn-liquid.webp' },
  ],
}
