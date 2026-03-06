'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'liquid-hover'

export const FROZEN_PROMPT = `
[CONTEXT] Liquid hover fill effect that reveals a colored layer from bottom to top using clipPath circle expansion.
[COMPONENT_SPEC] React component with a position:relative overflow:hidden container. An absolutely positioned fill layer animates its clipPath from circle(0% at 50% 100%) to circle(150% at 50% 100%) on hover. Children sit above the fill layer with position:relative and z-index:10.
[ANIMATION_TOKENS] ELEMENT:container TRIGGER:hover TYPE:clip-fill DIRECTION:radial-expand STAGGER:false EASING:ease-out DURATION:0.4s LIBRARY:motion STYLE:liquid
[CODE_CONSTRAINTS] Use motion/react motion.div for the fill layer. Track hover state via onMouseEnter/onMouseLeave. Fill color configurable via fillColor prop defaulting to var(--color-accent). Children remain readable above the fill.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Fill layer expands from bottom center as a circle on hover, retracts on mouse leave. Transition is smooth at 0.4s duration.
`

/**
 * Props for the LiquidHover component.
 */
interface LiquidHoverProps {
  /** The content to display inside the hover container. */
  children: React.ReactNode
  /** Optional CSS class name applied to the outer container. */
  className?: string
  /** The color used for the liquid fill layer. Defaults to 'var(--color-accent)'. */
  fillColor?: string
}

/**
 * LiquidHover wraps content in a container that reveals a liquid-style
 * fill layer expanding from the bottom center on hover using clipPath animation.
 *
 * The fill layer uses a circle clip-path that expands radially,
 * while children remain positioned above the fill with relative z-index.
 *
 * @example
 * ```tsx
 * <LiquidHover fillColor="#3b82f6">
 *   <span>Hover me</span>
 * </LiquidHover>
 * ```
 */
export default function LiquidHover({
  children,
  className,
  fillColor = 'var(--color-accent)',
}: LiquidHoverProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [isHovered, setIsHovered] = useState(false)

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: fillColor,
          zIndex: 0,
        }}
        animate={{
          clipPath: isHovered
            ? 'circle(150% at 50% 100%)'
            : 'circle(0% at 50% 100%)',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  )
}
