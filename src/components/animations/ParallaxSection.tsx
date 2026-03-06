'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export const ANIMATION_ID = 'parallax-image'

export const FROZEN_PROMPT = `
[CONTEXT] Parallax section effect that moves content at a different rate relative to scroll position.
[COMPONENT_SPEC] React component wrapping children in a motion.div whose y position is driven by scroll progress. Uses useScroll with target ref and useTransform to map scroll progress [0,1] to a percentage-based y offset. Outer container has overflow:hidden.
[ANIMATION_TOKENS] ELEMENT:section TRIGGER:onScroll TYPE:parallax DIRECTION:up|down STAGGER:false EASING:linear DURATION:continuous LIBRARY:motion STYLE:cinematic
[CODE_CONSTRAINTS] Use motion/react useScroll and useTransform. Offset config: ["start end", "end start"]. Speed prop controls intensity, direction prop controls movement direction.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Children move at a different rate than normal scroll. Speed and direction props correctly affect the parallax intensity and direction.
`

/**
 * Props for the ParallaxSection component.
 */
interface ParallaxSectionProps {
  /** The content to apply the parallax effect to. */
  children: React.ReactNode
  /** Optional CSS class name applied to the outer container. */
  className?: string
  /**
   * Controls the intensity of the parallax effect.
   * Higher values produce more dramatic movement. Defaults to 0.3.
   */
  speed?: number
  /**
   * Direction of the parallax movement relative to scroll.
   * - 'up': content moves upward as you scroll down
   * - 'down': content moves downward as you scroll down
   * Defaults to 'up'.
   */
  direction?: 'up' | 'down'
}

/**
 * ParallaxSection creates a scroll-driven parallax effect on its children.
 * The content moves at a different rate than the page scroll, creating
 * a sense of depth and visual interest.
 *
 * @example
 * ```tsx
 * <ParallaxSection speed={0.5} direction="up">
 *   <img src="/hero.jpg" alt="Hero" className="w-full h-full object-cover" />
 * </ParallaxSection>
 * ```
 */
export default function ParallaxSection({
  children,
  className,
  speed = 0.3,
  direction = 'up',
}: ParallaxSectionProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yValue = speed * 100 * (direction === 'down' ? 1 : -1)
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${yValue}%`])

  if (prefersReducedMotion) {
    return (
      <div className={className} style={{ overflow: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
