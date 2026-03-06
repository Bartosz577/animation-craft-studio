import type { AnimationEntry } from '@/lib/dictionary'

export const horizontalScroll: AnimationEntry = {
  id: 'horizontal-scroll',
  name: { pl: 'Horyzontalny scroll sekcji', en: 'Horizontal Scroll' },
  category: 'scroll',
  subcategory: 'horizontal',
  tags: ['horizontal', 'scroll', 'horyzontalny', 'gsap', 'sekcja', 'galeria'],
  description: {
    pl: 'Sekcja scrolluje się horyzontalnie przy pionowym przewijaniu. Popularny wzorzec do galerii i portfolio.',
    en: 'Vertical scroll translates content horizontally, creating a horizontal scroll effect.',
    technical: 'GSAP: ScrollTrigger pin + x translation = -(totalWidth - viewportWidth), scrub:1',
  },
  preview: { component: 'HorizontalScroll', thumbnail: '/thumbnails/horizontal-scroll.webp' },
  code: {
    minimal: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HorizontalScroll({ items }: { items: React.ReactNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => \`+=\${totalWidth}\`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ overflow: 'hidden' }}>
      <div ref={trackRef} style={{ display: 'flex', gap: '2rem', padding: '2rem', width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: '80vw', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', borderRadius: '1rem' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}`,
    full: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HorizontalScrollProps {
  items: React.ReactNode[]
  className?: string
  itemWidth?: string
  gap?: string
}

export function HorizontalScroll({ items, className, itemWidth = '80vw', gap = '2rem' }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => \`+=\${totalWidth}\`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      <div ref={trackRef} style={{ display: 'flex', gap, padding: '2rem', width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} style={{ minWidth: itemWidth, height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f0f', borderRadius: '1rem' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalScroll } from '@/data/animations/horizontal-scroll'

const meta: Meta<typeof HorizontalScroll> = {
  title: 'Animations/Scroll/HorizontalScroll',
  component: HorizontalScroll,
}

export default meta
type Story = StoryObj<typeof HorizontalScroll>

export const Default: Story = {
  args: { items: ['Panel 1', 'Panel 2', 'Panel 3', 'Panel 4'] },
}`,
  },
  prompt: {
    fragment: 'Vertical scroll translates content horizontally',
    full_prompt: '[CONTEXT] Gallery or portfolio section [COMPONENT_SPEC] Horizontal scroll via vertical scrolling [ANIMATION_TOKENS] element:section trigger:onScroll type:slide direction:left stagger:false easing:linear duration:dramatic library:gsap style:bold [VISUAL_REFERENCE] Panels slide left as user scrolls down [CODE_CONSTRAINTS] GSAP ScrollTrigger pin + x [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth horizontal movement, correct pin',
    frozen_hash: 'hs-g3h4i5j6',
  },
  tokens: {
    element: 'section',
    trigger: 'onScroll',
    type: 'slide',
    direction: 'left',
    stagger: false,
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
    pairs_well_with: ['text-split-reveal-up', 'clip-reveal-horizontal', 'counter-up'],
    conflicts_with: ['pin-section', 'parallax-image'],
  },
  examples: [
    { site: 'Locomotive', url: 'https://locomotive.ca', screenshot: '/examples/locomotive-horizontal.webp' },
  ],
}
