import type { AnimationEntry } from '@/lib/dictionary'

export const scrubTextReveal: AnimationEntry = {
  id: 'scrub-text-reveal',
  name: { pl: 'Odsłonięcie tekstu na scrollu', en: 'Scrub Text Reveal' },
  category: 'scroll',
  subcategory: 'text-reveal',
  tags: ['scrub', 'scroll', 'text', 'clip', 'reveal', 'odsłonięcie'],
  description: {
    pl: 'Tekst odsłania się progresywnie przez clip-path w miarę scrollowania. Efekt znany ze stron Apple.',
    en: 'Text progressively reveals via clipPath tied to scroll position.',
    technical: 'GSAP: ScrollTrigger scrub, clipPath inset animation from right to fully visible',
  },
  preview: { component: 'ScrubTextReveal', thumbnail: '/thumbnails/scrub-text-reveal.webp' },
  code: {
    minimal: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ScrubTextReveal({ text = 'Scroll to reveal this text' }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ minHeight: '200vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p ref={textRef} style={{ fontSize: '3rem', fontWeight: 700, position: 'sticky', top: '50%' }}>
        {text}
      </p>
    </div>
  )
}`,
    full: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrubTextRevealProps {
  text: string
  className?: string
  direction?: 'left' | 'right'
}

export function ScrubTextReveal({ text, className, direction = 'right' }: ScrubTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const from = direction === 'right' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { clipPath: from },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [direction])

  return (
    <div ref={containerRef} className={className} style={{ minHeight: '200vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p ref={textRef} style={{ fontSize: '3rem', fontWeight: 700, position: 'sticky', top: '50%' }}>
        {text}
      </p>
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { ScrubTextReveal } from '@/data/animations/scrub-text-reveal'

const meta: Meta<typeof ScrubTextReveal> = {
  title: 'Animations/Scroll/ScrubTextReveal',
  component: ScrubTextReveal,
  args: { text: 'Scroll to reveal this text' },
}

export default meta
type Story = StoryObj<typeof ScrubTextReveal>

export const Default: Story = {}`,
  },
  prompt: {
    fragment: 'Text reveals via clipPath tied to scroll scrub',
    full_prompt: '[CONTEXT] Editorial scroll reveal [COMPONENT_SPEC] ClipPath from right tied to scroll [ANIMATION_TOKENS] element:text trigger:onScroll type:clip direction:right stagger:false easing:linear duration:dramatic library:gsap style:editorial [VISUAL_REFERENCE] Text uncovers as user scrolls [CODE_CONSTRAINTS] GSAP ScrollTrigger scrub, clipPath [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Pixel-perfect scrub tracking',
    frozen_hash: 'str-c9d0e1f2',
  },
  tokens: {
    element: 'text',
    trigger: 'onScroll',
    type: 'clip',
    direction: 'right',
    stagger: false,
    easing: 'linear',
    duration: 'dramatic',
    library: 'gsap',
    style: 'editorial',
  },
  libraries: [
    { name: 'gsap', version: '>=3.0.0', required: true },
  ],
  config: { intensity: 3, performance: 'medium' },
  compatibility: {
    pairs_well_with: ['pin-section', 'parallax-image', 'hero-sequence'],
    conflicts_with: ['text-scramble'],
  },
  examples: [
    { site: 'Apple iPhone', url: 'https://apple.com/iphone', screenshot: '/examples/apple-scrub.webp' },
  ],
}
