import type { AnimationEntry } from '@/lib/dictionary'

export const textSplitRevealUp: AnimationEntry = {
  id: 'text-split-reveal-up',
  name: { pl: 'Reveal tekstu — litera po literze w gorę', en: 'Text Split Reveal Up' },
  category: 'typography',
  subcategory: 'split-animation',
  tags: ['split', 'reveal', 'typography', 'stagger', 'litery', 'animacja tekstu'],
  description: {
    pl: 'Tekst rozdziela się na pojedyncze znaki, które pojawiają się jeden po drugim od dołu. Idealny na nagłówki hero i sekcje editorial.',
    en: 'Text splits into individual characters that reveal upward with stagger delay.',
    technical: 'Motion: useInView, motion.span per char, y:40→0, opacity:0→1, staggerChildren:0.03',
  },
  preview: { component: 'TextSplitRevealUp', thumbnail: '/thumbnails/text-split-reveal-up.webp' },
  code: {
    minimal: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export function TextSplitRevealUp({ text = 'Animation Craft' }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const chars = text.split('')

  return (
    <div ref={ref} style={{ display: 'flex', overflow: 'hidden' }}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: i * 0.03,
            ease: [0.19, 1, 0.22, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}`,
    full: `'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface TextSplitRevealUpProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  staggerDelay?: number
}

export function TextSplitRevealUp({
  text,
  className,
  as: Tag = 'h1',
  delay = 0,
  staggerDelay = 0.03,
}: TextSplitRevealUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const words = text.split(' ')

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-flex', overflow: 'hidden', marginRight: '0.25em' }}>
          {word.split('').map((char, ci) => {
            const index = words.slice(0, wi).join(' ').length + ci + wi
            return (
              <motion.span
                key={ci}
                initial={{ y: 40, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
                transition={{
                  duration: 0.6,
                  delay: delay + index * staggerDelay,
                  ease: [0.19, 1, 0.22, 1],
                }}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { TextSplitRevealUp } from '@/data/animations/text-split-reveal-up'

const meta: Meta<typeof TextSplitRevealUp> = {
  title: 'Animations/Typography/TextSplitRevealUp',
  component: TextSplitRevealUp,
  args: { text: 'Animation Craft Studio' },
}

export default meta
type Story = StoryObj<typeof TextSplitRevealUp>

export const Default: Story = {}
export const Heading2: Story = { args: { as: 'h2', text: 'Hello World' } }`,
  },
  prompt: {
    fragment: 'Split text into characters, reveal each upward with stagger',
    full_prompt: '[CONTEXT] Hero heading animation [COMPONENT_SPEC] Split characters, stagger reveal up [ANIMATION_TOKENS] element:heading trigger:onView type:split direction:up stagger:true staggerDelay:0.03 easing:expo-out duration:medium library:motion style:editorial [VISUAL_REFERENCE] Characters slide up from below baseline [CODE_CONSTRAINTS] Motion useInView, no GSAP [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Each char animates independently with 30ms delay',
    frozen_hash: 'tsru-a1b2c3d4',
  },
  tokens: {
    element: 'heading',
    trigger: 'onView',
    type: 'split',
    direction: 'up',
    stagger: true,
    staggerDelay: 0.03,
    easing: 'expo-out',
    duration: 'medium',
    library: 'motion',
    style: 'editorial',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 3, performance: 'low' },
  compatibility: {
    pairs_well_with: ['hero-sequence', 'slide-up-fade', 'text-blur-fade-in'],
    conflicts_with: ['text-scramble'],
  },
  examples: [
    { site: 'Locomotive', url: 'https://locomotive.ca', screenshot: '/examples/locomotive-split.webp' },
  ],
}
