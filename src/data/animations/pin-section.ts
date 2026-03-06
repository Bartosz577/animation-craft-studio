import type { AnimationEntry } from '@/lib/dictionary'

export const pinSection: AnimationEntry = {
  id: 'pin-section',
  name: { pl: 'Przypinana sekcja — pin na scrollu', en: 'Pin Section' },
  category: 'scroll',
  subcategory: 'pin',
  tags: ['pin', 'scroll', 'przypinanie', 'sticky', 'gsap', 'sekcja'],
  description: {
    pl: 'Sekcja przypina się w viewporcie podczas scrollowania, pozwalając na animacje wewnątrz. Podstawa storytellingu scrollowego.',
    en: 'Section pins in viewport during scroll, enabling scroll-driven animations within.',
    technical: 'GSAP: ScrollTrigger pin:true, pinSpacing:true, scrub:1, timeline for inner animations',
  },
  preview: { component: 'PinSection', thumbnail: '/thumbnails/pin-section.webp' },
  code: {
    minimal: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function PinSection({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      })

      tl.from(contentRef.current, { opacity: 0, y: 60, duration: 0.5 })
        .to(contentRef.current, { opacity: 0, y: -60, duration: 0.5 }, '+=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={contentRef}>
        {children ?? <h2 style={{ fontSize: '2.5rem' }}>Pinned Content</h2>}
      </div>
    </div>
  )
}`,
    full: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PinSectionProps {
  children: React.ReactNode
  className?: string
  scrollLength?: string
  scrub?: number | boolean
}

export function PinSection({ children, className, scrollLength = '+=200%', scrub = 1 }: PinSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: scrollLength,
          pin: true,
          pinSpacing: true,
          scrub,
        },
      })

      tl.from(contentRef.current, { opacity: 0, y: 60, duration: 0.5 })
        .to(contentRef.current, { opacity: 0, y: -60, duration: 0.5 }, '+=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [scrollLength, scrub])

  return (
    <div ref={sectionRef} className={className} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { PinSection } from '@/data/animations/pin-section'

const meta: Meta<typeof PinSection> = {
  title: 'Animations/Scroll/PinSection',
  component: PinSection,
}

export default meta
type Story = StoryObj<typeof PinSection>

export const Default: Story = {
  args: { children: 'This section pins on scroll' },
}`,
  },
  prompt: {
    fragment: 'Section pins in viewport during scroll',
    full_prompt: '[CONTEXT] Scroll storytelling section [COMPONENT_SPEC] Pin section with inner timeline [ANIMATION_TOKENS] element:section trigger:onScroll type:fade direction:none stagger:true staggerDelay:0.3 easing:linear duration:dramatic library:gsap style:bold [VISUAL_REFERENCE] Content stays fixed while scrolling [CODE_CONSTRAINTS] GSAP ScrollTrigger pin [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth pin/unpin, no jump',
    frozen_hash: 'ps-y5z6a7b8',
  },
  tokens: {
    element: 'section',
    trigger: 'onScroll',
    type: 'fade',
    direction: 'none',
    stagger: true,
    staggerDelay: 0.3,
    easing: 'linear',
    duration: 'dramatic',
    library: 'gsap',
    style: 'bold',
  },
  libraries: [
    { name: 'gsap', version: '>=3.0.0', required: true },
  ],
  config: { intensity: 4, performance: 'medium' },
  compatibility: {
    pairs_well_with: ['parallax-image', 'scrub-text-reveal', 'text-split-reveal-up'],
    conflicts_with: ['horizontal-scroll'],
  },
  examples: [
    { site: 'Basement Studio', url: 'https://basement.studio', screenshot: '/examples/basement-pin.webp' },
  ],
}
