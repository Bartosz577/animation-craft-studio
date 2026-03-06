import type { AnimationEntry } from '@/lib/dictionary'

export const parallaxImage: AnimationEntry = {
  id: 'parallax-image',
  name: { pl: 'Parallax zdjęcia — przesunięcie przy scrollu', en: 'Parallax Image' },
  category: 'scroll',
  subcategory: 'parallax',
  tags: ['parallax', 'scroll', 'image', 'zdjęcie', 'przesunięcie', 'gsap'],
  description: {
    pl: 'Zdjęcie przesuwa się wolniej niż reszta strony tworząc efekt głębi. Klasyczny parallax z GSAP ScrollTrigger.',
    en: 'Image translates at a different rate than scroll, creating depth via GSAP ScrollTrigger.',
    technical: 'GSAP: gsap.to with ScrollTrigger scrub:true, y:"-20%", overflow:hidden container',
  },
  preview: { component: 'ParallaxImage', thumbnail: '/thumbnails/parallax-image.webp' },
  code: {
    minimal: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ParallaxImage({ src = '/placeholder.jpg', alt = '' }: { src?: string; alt?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: '-20%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', height: '400px', position: 'relative' }}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ width: '100%', height: '130%', objectFit: 'cover', position: 'absolute', top: 0 }}
      />
    </div>
  )
}`,
    full: `'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  height?: string
}

export function ParallaxImage({ src, alt, className, speed = 20, height = '400px' }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: \`-\${speed}%\`,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden', height, position: 'relative' }}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ width: '100%', height: \`\${100 + speed * 1.5}%\`, objectFit: 'cover', position: 'absolute', top: 0 }}
      />
    </div>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { ParallaxImage } from '@/data/animations/parallax-image'

const meta: Meta<typeof ParallaxImage> = {
  title: 'Animations/Scroll/ParallaxImage',
  component: ParallaxImage,
  args: { src: 'https://picsum.photos/1200/800', alt: 'Parallax demo' },
}

export default meta
type Story = StoryObj<typeof ParallaxImage>

export const Default: Story = {}`,
  },
  prompt: {
    fragment: 'Image moves slower than scroll creating depth parallax',
    full_prompt: '[CONTEXT] Editorial image section [COMPONENT_SPEC] Parallax y translation on scroll [ANIMATION_TOKENS] element:image trigger:onScroll type:slide direction:up stagger:false easing:linear duration:dramatic library:gsap style:editorial [VISUAL_REFERENCE] Image floats behind content [CODE_CONSTRAINTS] GSAP ScrollTrigger scrub [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth 60fps parallax, no jank',
    frozen_hash: 'pi-u1v2w3x4',
  },
  tokens: {
    element: 'image',
    trigger: 'onScroll',
    type: 'slide',
    direction: 'up',
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
    pairs_well_with: ['clip-reveal-horizontal', 'hero-sequence', 'text-split-reveal-up'],
    conflicts_with: ['horizontal-scroll'],
  },
  examples: [
    { site: 'Apple', url: 'https://apple.com', screenshot: '/examples/apple-parallax.webp' },
  ],
}
