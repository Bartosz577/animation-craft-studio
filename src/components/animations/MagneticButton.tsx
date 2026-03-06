'use client'

import React, { useRef } from 'react'
import { motion, useSpring } from 'motion/react'

export const ANIMATION_ID = 'magnetic-button'

export const FROZEN_PROMPT = `
[CONTEXT] Magnetic button effect that attracts the button toward the cursor on hover.
[COMPONENT_SPEC] React component rendering a motion.button that follows the cursor within its bounds using spring physics. On mouse move, calculates offset from button center and applies it scaled by strength. On mouse leave, springs back to origin.
[ANIMATION_TOKENS] ELEMENT:button TRIGGER:onHover TYPE:magnetic DIRECTION:follow-cursor STAGGER:false EASING:spring DURATION:continuous LIBRARY:motion STYLE:interactive
[CODE_CONSTRAINTS] Use motion/react useSpring for x and y values. stiffness:150, damping:15. Calculate offset from getBoundingClientRect center.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Button smoothly follows cursor within its bounds with spring physics and returns to center on mouse leave.
`

/**
 * Props for the MagneticButton component.
 */
interface MagneticButtonProps {
  /** The button content (text, icons, or any React node). */
  children: React.ReactNode
  /** Optional CSS class name applied to the button element. */
  className?: string
  /**
   * Controls how strongly the button is attracted to the cursor.
   * A value of 0 means no movement; 1 means the button center follows the cursor exactly.
   * Defaults to 0.4.
   */
  strength?: number
}

/**
 * MagneticButton creates an interactive button that is visually attracted
 * toward the user's cursor when hovered, using spring-based physics for
 * smooth, natural motion.
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.5} className="px-6 py-3 bg-black text-white rounded-full">
 *   Get Started
 * </MagneticButton>
 * ```
 */
export default function MagneticButton({
  children,
  className,
  strength = 0.4,
}: MagneticButtonProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const ref = useRef<HTMLButtonElement>(null)

  const x = useSpring(0, { stiffness: 150, damping: 15 })
  const y = useSpring(0, { stiffness: 150, damping: 15 })

  if (prefersReducedMotion) {
    return (
      <button className={className}>
        {children}
      </button>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left - rect.width / 2) * strength
    const offsetY = (e.clientY - rect.top - rect.height / 2) * strength

    x.set(offsetX)
    y.set(offsetY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.button>
  )
}
