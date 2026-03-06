'use client'

import React, { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export const ANIMATION_ID = 'cursor-trail'

export const FROZEN_PROMPT = `
[CONTEXT]
A decorative cursor trail effect that renders a series of fading dots following the user's mouse pointer.
As the user moves the mouse within the component bounds, small circles appear at the cursor position and
gradually shrink and fade out, creating a comet-tail or sparkle-trail visual effect.

[COMPONENT_SPEC]
React component that wraps children in a container tracking onMouseMove events.
Maintains an array of the last N cursor positions using useRef with a counter for unique keys.
Each trail dot is rendered as an absolutely positioned motion.div circle.
Dots scale down from 1 to 0 and fade from 0.8 to 0 based on their age in the trail array.
The trail updates on each mouse move, pushing new positions and trimming old ones.

[ANIMATION_TOKENS]
ELEMENT:cursor-dots TRIGGER:onMouseMove TYPE:scale+fade DIRECTION:none
STAGGER:natural(position-based) EASING:ease-out DURATION:var(--duration-fast)
SIZE:8px COLOR:var(--color-accent) COUNT:8 LIBRARY:motion/react STYLE:playful

[CODE_CONSTRAINTS]
- Use 'motion/react' for all motion imports (NOT framer-motion)
- Track positions as {x, y, id} where id is an incrementing counter for stable keys
- Use useRef for the counter and position array, useState to trigger re-renders
- Respect prefers-reduced-motion: render children only, no trail
- Container must be position:relative so dots are positioned correctly
- Dots use pointer-events:none so they don't interfere with interactions

[OUTPUT_FORMAT]
Single-file React component with TypeScript, default export + named FROZEN_PROMPT and ANIMATION_ID exports.

[VALIDATION_CRITERIA]
- Trail follows mouse smoothly with no jank
- Dots fade and shrink correctly based on their position in the trail
- Oldest dots are removed when count limit is exceeded
- No trail renders when prefers-reduced-motion is enabled
- No memory leaks from unbounded position arrays
`

/**
 * A single point in the cursor trail.
 */
interface TrailPoint {
  /** The x coordinate relative to the container. */
  x: number
  /** The y coordinate relative to the container. */
  y: number
  /** Unique identifier for stable React keys. */
  id: number
}

/**
 * Props for the CursorTrail component.
 */
interface CursorTrailProps {
  /** The content to render inside the trail container. */
  children: React.ReactNode
  /** The color of the trail dots. Defaults to 'var(--color-accent)'. */
  color?: string
  /** The diameter of each trail dot in pixels. Defaults to 8. */
  size?: number
  /** The maximum number of trail dots to display at once. Defaults to 8. */
  count?: number
}

/**
 * CursorTrail renders a series of fading dots that follow the user's cursor
 * within the component's bounds. Each dot shrinks and fades based on its
 * age in the trail, creating a comet-tail effect.
 *
 * @example
 * ```tsx
 * <CursorTrail color="#ff6b6b" size={10} count={12}>
 *   <div className="h-96 bg-slate-900 rounded-xl">
 *     <p>Move your cursor here</p>
 *   </div>
 * </CursorTrail>
 * ```
 */
export default function CursorTrail({
  children,
  color = 'var(--color-accent)',
  size = 8,
  count = 8,
}: CursorTrailProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [trail, setTrail] = useState<TrailPoint[]>([])
  const counterRef = useRef(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = counterRef.current++

      setTrail((prev) => {
        const next = [...prev, { x, y, id }]
        if (next.length > count) {
          return next.slice(next.length - count)
        }
        return next
      })
    },
    [count]
  )

  const handleMouseLeave = useCallback(() => {
    setTrail([])
  }, [])

  if (prefersReducedMotion) {
    return <div style={{ position: 'relative' }}>{children}</div>
  }

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {trail.map((point, index) => {
          const age = (trail.length - 1 - index) / (trail.length - 1 || 1)
          const scale = 1 - age * 0.8
          const opacity = 0.8 - age * 0.7

          return (
            <motion.div
              key={point.id}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale, opacity }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                pointerEvents: 'none',
              }}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}
