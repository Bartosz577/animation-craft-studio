'use client'

import React from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'stagger-list'

export const FROZEN_PROMPT = `
[CONTEXT] Stagger list animation that reveals each child element in sequence with configurable direction.
[COMPONENT_SPEC] React component that wraps children in a motion.div parent with staggerChildren variants. Each direct child is wrapped in a motion.div with hidden/visible variants. The initial offset direction is configurable (up, down, left, right) with a 30px displacement and opacity 0->1. Uses viewport-based triggering with once:true so the animation plays a single time when scrolled into view.
[ANIMATION_TOKENS] ELEMENT:list TRIGGER:inView TYPE:fade+slide DIRECTION:configurable(up|down|left|right) STAGGER:true EASING:expo-out DURATION:medium LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react variants with staggerChildren on parent and whileInView trigger. React.Children.map wraps each child in a motion.div. Direction prop maps to initial x/y offset values. viewport={{ once: true }} ensures single trigger.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Children animate into view one by one with the specified stagger delay. Direction correctly maps to initial offset. Animation triggers once when the list scrolls into the viewport.
`

/**
 * Props for the StaggerList component.
 */
interface StaggerListProps {
  /** The list items or child elements to animate in with staggered timing. */
  children: React.ReactNode
  /** Optional CSS class name applied to the parent container. */
  className?: string
  /** Delay in seconds between each child's animation start. Defaults to 0.1. */
  staggerDelay?: number
  /** The direction children animate in from. Defaults to 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right'
}

/**
 * Maps a direction string to the initial motion values for the hidden state.
 */
const directionMap: Record<
  'up' | 'down' | 'left' | 'right',
  { x?: number; y?: number; opacity: number }
> = {
  up: { y: 30, opacity: 0 },
  down: { y: -30, opacity: 0 },
  left: { x: -30, opacity: 0 },
  right: { x: 30, opacity: 0 },
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
    },
  }),
}

const childVariants = {
  hidden: (direction: 'up' | 'down' | 'left' | 'right') =>
    directionMap[direction],
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
    },
  },
}

/**
 * StaggerList animates each of its direct children into view with a
 * configurable stagger delay and directional slide. The animation
 * triggers once when the component scrolls into the viewport.
 *
 * @example
 * ```tsx
 * <StaggerList direction="left" staggerDelay={0.15}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerList>
 * ```
 */
export default function StaggerList({
  children,
  className,
  staggerDelay = 0.1,
  direction = 'up',
}: StaggerListProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={staggerDelay}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={childVariants} custom={direction}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
