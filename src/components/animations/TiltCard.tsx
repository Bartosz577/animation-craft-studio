'use client'

import React from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export const ANIMATION_ID = 'tilt-3d-card'

export const FROZEN_PROMPT = `
[CONTEXT] 3D tilt card effect that follows mouse position to create a perspective rotation.
[COMPONENT_SPEC] React component that tracks mouse position relative to card center and applies rotateX/rotateY transforms. Uses useMotionValue and useSpring from motion/react for smooth interpolation. Perspective set to 1000px for realistic 3D depth.
[ANIMATION_TOKENS] ELEMENT:card TRIGGER:mouseMove TYPE:tilt DIRECTION:3d-perspective STAGGER:false EASING:spring(200,20) DURATION:continuous LIBRARY:motion STYLE:interactive
[CODE_CONSTRAINTS] Use motion/react useMotionValue + useSpring. Calculate tilt from normalized mouse offset (-0.5 to 0.5). rotateX = y * -maxTilt (inverted for natural feel), rotateY = x * maxTilt. Reset to 0 on mouse leave. maxTilt prop defaults to 15 degrees.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Card tilts smoothly following cursor with spring physics. Returns to flat on mouse leave. Max rotation capped by maxTilt prop.
`

/**
 * Props for the TiltCard component.
 */
interface TiltCardProps {
  /** The content to display inside the tilt card. */
  children: React.ReactNode
  /** Optional CSS class name applied to the card container. */
  className?: string
  /** Maximum tilt angle in degrees. Defaults to 15. */
  maxTilt?: number
}

/**
 * TiltCard creates a 3D perspective tilt effect that follows the mouse cursor.
 *
 * The card rotates on both X and Y axes based on the cursor position
 * relative to the card center, using spring physics for smooth motion.
 * On mouse leave the card smoothly returns to its flat position.
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={20} className="rounded-xl shadow-lg p-8">
 *   <h3>Interactive Card</h3>
 *   <p>Move your mouse over me</p>
 * </TiltCard>
 * ```
 */
export default function TiltCard({
  children,
  className,
  maxTilt = 15,
}: TiltCardProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const rotateXValue = useMotionValue(0)
  const rotateYValue = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 20 }
  const springX = useSpring(rotateXValue, springConfig)
  const springY = useSpring(rotateYValue, springConfig)

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateXValue.set(y * -maxTilt)
    rotateYValue.set(x * maxTilt)
  }

  const handleMouseLeave = () => {
    rotateXValue.set(0)
    rotateYValue.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
