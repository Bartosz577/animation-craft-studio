import type { AnimationEntry } from '@/lib/dictionary'

export const textBlurFadeIn: AnimationEntry = {
  id: 'text-blur-fade-in',
  name: { pl: 'Blur fade in — tekst wyłania się z rozmycia', en: 'Text Blur Fade In' },
  category: 'typography',
  subcategory: 'entrance',
  tags: ['blur', 'fade', 'rozmycie', 'entrance', 'minimalistyczny', 'typography'],
  description: {
    pl: 'Tekst pojawia się z rozmycia i pełną przezroczystością, przechodząc do ostrego i widocznego stanu. Subtelny i elegancki efekt.',
    en: 'Text emerges from blur and opacity zero to sharp and fully visible.',
    technical: 'Motion: animate filter:blur(12px)→blur(0px) and opacity:0→1, ease expo-out',
  },
  preview: { component: 'TextBlurFadeIn', thumbnail: '/thumbnails/text-blur-fade-in.webp' },
  code: {
    minimal: `'use client'

import { motion } from 'motion/react'

export function TextBlurFadeIn({ children = 'Hello World' }: { children?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ filter: 'blur(12px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}`,
    full: `'use client'

import { motion } from 'motion/react'

interface TextBlurFadeInProps {
  children: React.ReactNode
  className?: string
  blur?: number
  duration?: number
  delay?: number
}

export function TextBlurFadeIn({
  children,
  className,
  blur = 12,
  duration = 0.6,
  delay = 0,
}: TextBlurFadeInProps) {
  return (
    <motion.div
      initial={{ filter: \`blur(\${blur}px)\`, opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { TextBlurFadeIn } from '@/data/animations/text-blur-fade-in'

const meta: Meta<typeof TextBlurFadeIn> = {
  title: 'Animations/Typography/TextBlurFadeIn',
  component: TextBlurFadeIn,
  args: { children: 'Animation Craft Studio' },
}

export default meta
type Story = StoryObj<typeof TextBlurFadeIn>

export const Default: Story = {}
export const HeavyBlur: Story = { args: { blur: 24, duration: 1.2 } }`,
  },
  prompt: {
    fragment: 'Text fades in from blur to sharp',
    full_prompt: '[CONTEXT] Subtle text entrance [COMPONENT_SPEC] Blur and opacity transition [ANIMATION_TOKENS] element:text trigger:onLoad type:blur direction:none stagger:false easing:expo-out duration:medium library:motion style:minimal [VISUAL_REFERENCE] Text de-blurs smoothly [CODE_CONSTRAINTS] Motion initial/animate, filter:blur [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth blur transition without flicker',
    frozen_hash: 'tbfi-q7r8s9t0',
  },
  tokens: {
    element: 'text',
    trigger: 'onLoad',
    type: 'blur',
    direction: 'none',
    stagger: false,
    easing: 'expo-out',
    duration: 'medium',
    library: 'motion',
    style: 'minimal',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 1, performance: 'low' },
  compatibility: {
    pairs_well_with: ['text-split-reveal-up', 'hero-sequence', 'slide-up-fade'],
    conflicts_with: ['text-scramble'],
  },
  examples: [
    { site: 'Linear', url: 'https://linear.app', screenshot: '/examples/linear-blur.webp' },
  ],
}
