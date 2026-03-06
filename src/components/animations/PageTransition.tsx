'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

export const ANIMATION_ID = 'page-transition'

export const FROZEN_PROMPT = `
[CONTEXT]
A page-level transition component that uses CSS clip-path to reveal and conceal page content.
On mount, the page content is revealed by animating the clip-path from fully clipped at the bottom
to fully visible. On unmount, the content is concealed by clipping from the top.
This creates a cinematic curtain-wipe effect suitable for route transitions.

[COMPONENT_SPEC]
React component that wraps page content with AnimatePresence and a motion.div.
On mount (initial state): clipPath is "inset(0 0 100% 0)" — content fully hidden from bottom.
On animate: clipPath transitions to "inset(0 0 0% 0)" — content fully revealed.
On exit: clipPath animates to "inset(100% 0 0 0)" — content clips away from the top.
Duration is 0.6 seconds with an expo-out easing curve [0.19, 1, 0.22, 1].

[ANIMATION_TOKENS]
ELEMENT:page-wrapper TRIGGER:onMount+onUnmount TYPE:clip-path-wipe DIRECTION:bottom-to-top(enter),top-to-bottom(exit)
STAGGER:none EASING:[0.19,1,0.22,1](ease-out-expo) DURATION:0.6s
LIBRARY:motion/react STYLE:cinematic

[CODE_CONSTRAINTS]
- Use 'motion/react' for all motion imports (NOT framer-motion)
- Wrap with AnimatePresence for exit animation support
- Use motion.div with initial, animate, and exit props
- Respect prefers-reduced-motion: render children immediately with no clip-path animation
- Use CSS custom properties for easing where appropriate
- Component should accept className for additional styling

[OUTPUT_FORMAT]
Single-file React component with TypeScript, default export + named FROZEN_PROMPT and ANIMATION_ID exports.

[VALIDATION_CRITERIA]
- Content reveals smoothly from bottom on mount via clip-path
- Content conceals smoothly toward top on unmount via clip-path
- Easing matches expo-out curve [0.19, 1, 0.22, 1]
- Duration is exactly 0.6 seconds
- No animation plays if prefers-reduced-motion is enabled
- AnimatePresence correctly handles mount/unmount lifecycle
`

/**
 * Props for the PageTransition component.
 */
interface PageTransitionProps {
  /** The page content to wrap with clip-path transition animations. */
  children: React.ReactNode
  /** Optional CSS class name applied to the animated wrapper div. */
  className?: string
}

/**
 * PageTransition wraps page content with a cinematic clip-path reveal/conceal animation.
 * On mount, content is revealed by un-clipping from bottom to top.
 * On unmount, content is concealed by clipping from bottom to top.
 *
 * Designed to be used at the layout or page level for route transitions.
 *
 * @example
 * ```tsx
 * <PageTransition className="min-h-screen">
 *   <main>
 *     <h1>Page Content</h1>
 *   </main>
 * </PageTransition>
 * ```
 */
export default function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        exit={{ clipPath: 'inset(100% 0 0 0)' }}
        transition={{
          duration: 0.6,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
