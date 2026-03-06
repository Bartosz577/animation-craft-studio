import type { AnimationEntry } from '@/lib/dictionary'

export const textWave: AnimationEntry = {
  id: 'text-wave',
  name: { pl: 'Fala tekstu — znaki falują w pionie', en: 'Text Wave' },
  category: 'typography',
  subcategory: 'text-effect',
  tags: ['wave', 'fala', 'loop', 'typography', 'zabawny', 'playful'],
  description: {
    pl: 'Znaki poruszają się w górę i dół tworząc efekt fali. Animacja zapętla się nieskończenie, idealna do akcentów UI.',
    en: 'Characters animate vertically in a sine wave pattern, looping infinitely.',
    technical: 'Motion: motion.span per char, y animate with repeat:Infinity, custom delay per index creates wave',
  },
  preview: { component: 'TextWave', thumbnail: '/thumbnails/text-wave.webp' },
  code: {
    minimal: `'use client'

import { motion } from 'motion/react'

export function TextWave({ text = 'Wave Text' }: { text?: string }) {
  return (
    <span style={{ display: 'inline-flex' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 1,
            delay: i * 0.05,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}`,
    full: `'use client'

import { motion } from 'motion/react'

interface TextWaveProps {
  text: string
  className?: string
  amplitude?: number
  staggerDelay?: number
  duration?: number
}

export function TextWave({
  text,
  className,
  amplitude = 12,
  staggerDelay = 0.05,
  duration = 1,
}: TextWaveProps) {
  return (
    <span className={className} style={{ display: 'inline-flex' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -amplitude, 0] }}
          transition={{
            duration,
            delay: i * staggerDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { TextWave } from '@/data/animations/text-wave'

const meta: Meta<typeof TextWave> = {
  title: 'Animations/Typography/TextWave',
  component: TextWave,
  args: { text: 'Wave Animation' },
}

export default meta
type Story = StoryObj<typeof TextWave>

export const Default: Story = {}
export const LargeAmplitude: Story = { args: { amplitude: 24, duration: 1.5 } }`,
  },
  prompt: {
    fragment: 'Characters animate in sine wave pattern looping infinitely',
    full_prompt: '[CONTEXT] Playful text accent [COMPONENT_SPEC] Chars move up/down in wave [ANIMATION_TOKENS] element:text trigger:onLoad type:wave direction:none stagger:true staggerDelay:0.05 easing:ease-in-out duration:slow library:motion style:playful [VISUAL_REFERENCE] Mexican wave through characters [CODE_CONSTRAINTS] Motion animate, repeat:Infinity [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth continuous wave, no jank',
    frozen_hash: 'twav-i9j0k1l2',
  },
  tokens: {
    element: 'text',
    trigger: 'onLoad',
    type: 'wave',
    direction: 'none',
    stagger: true,
    staggerDelay: 0.05,
    easing: 'ease-in-out',
    duration: 'slow',
    library: 'motion',
    style: 'playful',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['cursor-trail', 'liquid-hover', 'magnetic-button'],
    conflicts_with: ['text-split-reveal-up'],
  },
  examples: [
    { site: 'Stripe', url: 'https://stripe.com', screenshot: '/examples/stripe-wave.webp' },
  ],
}
