'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView, useSpring, useMotionValueEvent } from 'motion/react'

export const ANIMATION_ID = 'counter-up'

export const FROZEN_PROMPT = `
[CONTEXT] Animated counter that counts up from 0 to a target number when scrolled into view.
[COMPONENT_SPEC] React component that uses useInView to detect visibility, then animates a spring-based motion value from 0 to target. Displays the floored integer value with optional prefix and suffix strings. Animation triggers once when the element enters the viewport.
[ANIMATION_TOKENS] ELEMENT:number TRIGGER:inView TYPE:counter DIRECTION:up STAGGER:false EASING:spring(auto) DURATION:configurable LIBRARY:motion STYLE:data-viz
[CODE_CONSTRAINTS] Use motion/react useInView (once:true), useSpring, and useMotionValueEvent. Spring stiffness derived from duration prop (lower duration = higher stiffness). Display value updated via React state with Math.floor. Supports prefix and suffix strings around the number.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Number counts from 0 to target smoothly with spring physics. Animation fires only once on scroll into view. Final displayed value matches target exactly.
`

/**
 * Props for the CounterUp component.
 */
interface CounterUpProps {
  /** The target number to count up to. */
  target: number
  /** Optional string displayed after the number (e.g. '%', '+'). */
  suffix?: string
  /** Optional string displayed before the number (e.g. '$', '#'). */
  prefix?: string
  /** Optional CSS class name applied to the container span. */
  className?: string
  /** Duration of the count-up animation in seconds. Defaults to 2. */
  duration?: number
}

/**
 * CounterUp animates a number from 0 to a target value using spring physics
 * when the element scrolls into view. The animation triggers only once.
 *
 * Supports optional prefix and suffix strings around the displayed number.
 * The spring stiffness is automatically adjusted based on the duration prop.
 *
 * @example
 * ```tsx
 * <CounterUp target={1500} prefix="$" suffix="+" duration={2.5} />
 * ```
 */
export default function CounterUp({
  target,
  suffix = '',
  prefix = '',
  className,
  duration = 2,
}: CounterUpProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  // Higher stiffness for shorter durations, lower for longer
  const stiffness = Math.max(20, 100 / duration)
  const damping = Math.max(15, 20 + duration * 2)

  const springValue = useSpring(0, { stiffness, damping })

  useMotionValueEvent(springValue, 'change', (v) => {
    setDisplayValue(Math.floor(v))
  })

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(target)
      return
    }

    if (isInView) {
      springValue.set(target)
    }
  }, [isInView, target, springValue, prefersReducedMotion])

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {target}
        {suffix}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
