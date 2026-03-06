import type { AnimationEntry } from '@/lib/dictionary'

export const glowBorder: AnimationEntry = {
  id: 'glow-border',
  name: { pl: 'Świecąca ramka na hoverze', en: 'Glow Border' },
  category: 'hover',
  subcategory: 'glow',
  tags: ['glow', 'border', 'ramka', 'hover', 'css', 'luksusowy'],
  description: {
    pl: 'Ramka karty świeci i obraca gradient na hover. Efekt premium znany ze stron SaaS i technologicznych.',
    en: 'Card border glows with rotating gradient and box-shadow on hover, pure CSS animation.',
    technical: 'CSS: @keyframes rotate gradient, box-shadow glow, border-image or conic-gradient, group-hover',
  },
  preview: { component: 'GlowBorder', thumbnail: '/thumbnails/glow-border.webp' },
  code: {
    minimal: `'use client'

export function GlowBorder({ children }: { children?: React.ReactNode }) {
  return (
    <div className="group" style={{ position: 'relative', width: 300, padding: 1 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1rem',
          background: 'conic-gradient(from 0deg, #a0ff60, #4a8a20, #a0ff60)',
          opacity: 0.3,
          transition: 'opacity 0.3s ease-out',
        }}
        className="group-hover:opacity-100"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1rem',
          background: 'conic-gradient(from 0deg, #a0ff60, #4a8a20, #a0ff60)',
          filter: 'blur(16px)',
          opacity: 0,
          transition: 'opacity 0.3s ease-out',
        }}
        className="group-hover:opacity-40"
      />
      <div
        style={{
          position: 'relative',
          background: '#0f0f0f',
          borderRadius: 'calc(1rem - 1px)',
          padding: '2rem',
          zIndex: 1,
        }}
      >
        {children ?? <span style={{ color: '#f0f0f0' }}>Hover for glow</span>}
      </div>
    </div>
  )
}`,
    full: `'use client'

interface GlowBorderProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  borderRadius?: string
}

export function GlowBorder({
  children,
  className,
  glowColor = '#a0ff60',
  borderRadius = '1rem',
}: GlowBorderProps) {
  const dimColor = glowColor + '66'

  return (
    <div className={\`group \${className ?? ''}\`} style={{ position: 'relative', padding: 1 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: \`conic-gradient(from 0deg, \${glowColor}, \${dimColor}, \${glowColor})\`,
          opacity: 0.3,
          transition: 'opacity 0.3s ease-out',
        }}
        className="group-hover:opacity-100"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          background: \`conic-gradient(from 0deg, \${glowColor}, \${dimColor}, \${glowColor})\`,
          filter: 'blur(16px)',
          opacity: 0,
          transition: 'opacity 0.3s ease-out',
        }}
        className="group-hover:opacity-40"
      />
      <div
        style={{
          position: 'relative',
          background: '#0f0f0f',
          borderRadius: \`calc(\${borderRadius} - 1px)\`,
          padding: '2rem',
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { GlowBorder } from '@/data/animations/glow-border'

const meta: Meta<typeof GlowBorder> = {
  title: 'Animations/Hover/GlowBorder',
  component: GlowBorder,
  args: { children: 'Glow on hover' },
}

export default meta
type Story = StoryObj<typeof GlowBorder>

export const Default: Story = {}
export const CustomGlow: Story = { args: { glowColor: '#6060ff' } }`,
  },
  prompt: {
    fragment: 'Rotating gradient border with glow on hover',
    full_prompt: '[CONTEXT] Premium card hover [COMPONENT_SPEC] Conic gradient border + box-shadow glow [ANIMATION_TOKENS] element:card trigger:onHover type:fade direction:none stagger:false easing:ease-out duration:fast library:css style:luxury [VISUAL_REFERENCE] Neon border glow [CODE_CONSTRAINTS] Pure CSS with group-hover [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth glow transition, no flicker',
    frozen_hash: 'gb-a3b4c5d6',
  },
  tokens: {
    element: 'card',
    trigger: 'onHover',
    type: 'fade',
    direction: 'none',
    stagger: false,
    easing: 'ease-out',
    duration: 'fast',
    library: 'css',
    style: 'luxury',
  },
  libraries: [{ name: 'css', version: 'native', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['tilt-3d-card', 'stagger-grid-reveal', 'scale-in-center'],
    conflicts_with: ['cursor-trail'],
  },
  examples: [
    { site: 'Linear', url: 'https://linear.app', screenshot: '/examples/linear-glow.webp' },
  ],
}
