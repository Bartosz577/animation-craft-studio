'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'

export const ANIMATION_ID = 'stagger-grid-reveal'

export const FROZEN_PROMPT = `
[CONTEXT]
A scroll-triggered grid layout where each child item reveals itself as the user scrolls it into the viewport.
Items stagger in sequentially based on their index, creating a cascading wave of content appearing on screen.

[COMPONENT_SPEC]
React component that wraps arbitrary children in a CSS grid layout.
Each direct child is automatically wrapped in a motion.div that observes its own intersection with the viewport.
When a child enters the viewport, it animates from y:40 + opacity:0 to y:0 + opacity:1.
Each child's animation is delayed by index * staggerDelay to create the stagger effect.
The grid uses CSS auto-fill columns by default but accepts className for full layout customization.

[ANIMATION_TOKENS]
ELEMENT:grid-children TRIGGER:onScroll(inView) TYPE:fade+slide DIRECTION:up STAGGER:true
STAGGER_DELAY:0.08s EASING:var(--ease-out-expo) DURATION:var(--duration-medium)
DISTANCE:40px LIBRARY:motion/react STYLE:editorial

[CODE_CONSTRAINTS]
- Use 'motion/react' for all motion imports (NOT framer-motion)
- Use useInView hook per child for individual scroll detection
- Use React.Children.map to automatically wrap children
- Respect prefers-reduced-motion: skip all animation if enabled
- Use CSS custom properties for duration and easing where appropriate
- Default grid: auto-fill columns with minmax(280px, 1fr)

[OUTPUT_FORMAT]
Single-file React component with TypeScript, default export + named FROZEN_PROMPT and ANIMATION_ID exports.

[VALIDATION_CRITERIA]
- Each child animates independently when scrolled into view
- Stagger delay is correctly applied per child index
- Grid layout is responsive and customizable via className
- No animation plays if prefers-reduced-motion is enabled
- No hydration mismatch issues
`

/**
 * Props for the ScrollRevealGrid component.
 */
interface ScrollRevealGridProps {
  /** The grid items to render. Each direct child is wrapped in a reveal animation. */
  children: React.ReactNode
  /** Optional CSS class name applied to the grid container. Override default grid layout here. */
  className?: string
  /** Delay in seconds between each child's animation start. Defaults to 0.08. */
  staggerDelay?: number
}

/**
 * A single grid item that observes its own viewport intersection
 * and animates in when visible.
 */
function RevealItem({
  children,
  index,
  staggerDelay,
}: {
  /** The content to render inside this grid cell. */
  children: React.ReactNode
  /** The index of this item in the grid, used to calculate stagger delay. */
  index: number
  /** The base stagger delay in seconds, multiplied by index. */
  staggerDelay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      animate={
        isInView
          ? { y: 0, opacity: 1 }
          : { y: 40, opacity: 0 }
      }
      transition={{
        duration: 0.6,
        delay: index * staggerDelay,
        ease: [0.19, 1, 0.22, 1],
      }}
      style={{
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealGrid wraps each direct child in a scroll-triggered reveal animation.
 * Children stagger into view as they enter the viewport, creating a cascading wave effect.
 *
 * @example
 * ```tsx
 * <ScrollRevealGrid staggerDelay={0.1} className="grid grid-cols-3 gap-6">
 *   <Card title="One" />
 *   <Card title="Two" />
 *   <Card title="Three" />
 * </ScrollRevealGrid>
 * ```
 */
export default function ScrollRevealGrid({
  children,
  className,
  staggerDelay = 0.08,
}: ScrollRevealGridProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  if (prefersReducedMotion) {
    return (
      <div
        className={className}
        style={
          className
            ? undefined
            : {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
              }
        }
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={
        className
          ? undefined
          : {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }
      }
    >
      {React.Children.map(children, (child, index) => (
        <RevealItem key={index} index={index} staggerDelay={staggerDelay}>
          {child}
        </RevealItem>
      ))}
    </div>
  )
}
