'use client'

import React from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'morphing-shape'

export const FROZEN_PROMPT = `
[CONTEXT] Morphing SVG blob shape animation that continuously transitions between organic forms.
[COMPONENT_SPEC] React component that renders an SVG with a motion.path element morphing between 3 organic blob shapes. All 3 path d-strings share the same number and type of path commands (M, C, C, C, C, Z) to ensure smooth interpolation. The animation loops infinitely with easeInOut over 12 seconds. Color and animation toggle are configurable via props.
[ANIMATION_TOKENS] ELEMENT:svg-path TRIGGER:auto TYPE:morph DIRECTION:none STAGGER:false EASING:easeInOut DURATION:12s LIBRARY:motion STYLE:organic
[CODE_CONSTRAINTS] Use motion/react motion.path with animate={{ d: [...shapes] }}. All shapes must have identical path command structures for valid SVG interpolation. SVG viewBox="0 0 400 400". If animate=false, display shape1 statically. prefers-reduced-motion shows shape1 with no animation.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Path morphs smoothly between 3 blobs in an infinite loop. No flicker or jump between shapes. Static display when animation is disabled or reduced motion is preferred.
`

/**
 * Props for the MorphingShape component.
 */
interface MorphingShapeProps {
  /** Optional CSS class name applied to the SVG element. */
  className?: string
  /** The fill color of the morphing shape. Defaults to 'var(--color-accent)'. */
  color?: string
  /** Whether the morphing animation is active. Defaults to true. */
  animate?: boolean
}

const shape1 =
  'M 220 100 C 220 50, 280 50, 280 100 C 280 150, 320 200, 280 250 C 240 300, 180 300, 160 250 C 140 200, 160 150, 220 100 Z'
const shape2 =
  'M 200 80 C 240 30, 300 60, 300 120 C 300 180, 340 220, 280 270 C 220 320, 160 280, 140 220 C 120 160, 160 130, 200 80 Z'
const shape3 =
  'M 240 90 C 260 40, 310 70, 290 130 C 270 190, 330 230, 260 260 C 190 290, 150 260, 170 200 C 190 140, 220 140, 240 90 Z'

/**
 * MorphingShape renders an SVG with a single path that continuously
 * morphs between three organic blob shapes. The animation loops
 * infinitely with smooth easeInOut transitions over a 12-second cycle.
 *
 * @example
 * ```tsx
 * <MorphingShape color="#ff6060" animate />
 * ```
 *
 * @example
 * ```tsx
 * // Static shape, no animation
 * <MorphingShape animate={false} />
 * ```
 */
export default function MorphingShape({
  className,
  color = 'var(--color-accent)',
  animate: shouldAnimate = true,
}: MorphingShapeProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const isAnimating = shouldAnimate && !prefersReducedMotion

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isAnimating ? (
        <motion.path
          d={shape1}
          fill={color}
          animate={{
            d: [shape1, shape2, shape3, shape1],
          }}
          transition={{
            duration: 12,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      ) : (
        <path d={shape1} fill={color} />
      )}
    </svg>
  )
}
