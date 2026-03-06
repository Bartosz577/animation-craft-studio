'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'typewriter-text'

export const FROZEN_PROMPT = `
[CONTEXT] Typewriter text animation that reveals characters one at a time with an optional blinking cursor.
[COMPONENT_SPEC] React component that takes a text string and progressively reveals it character by character using useState and useEffect with setInterval. A blinking cursor (|) is optionally displayed at the end using motion.span with opacity cycling [0, 1] in a repeat/reverse loop.
[ANIMATION_TOKENS] ELEMENT:text TRIGGER:onMount TYPE:typewriter DIRECTION:ltr STAGGER:false EASING:linear DURATION:custom(speed) LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react for cursor animation only. Core typewriter logic uses native React hooks (useState, useEffect, setInterval). Interval cleaned up on unmount. prefers-reduced-motion check renders full text immediately.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Characters appear one at a time at the given speed. Cursor blinks smoothly. Interval is properly cleaned up. Full text shown instantly when reduced motion is preferred.
`

/**
 * Props for the TypewriterText component.
 */
interface TypewriterTextProps {
  /** The full text string to type out character by character. */
  text: string
  /** Speed of typing in milliseconds per character. Defaults to 50. */
  speed?: number
  /** Optional CSS class name applied to the root span element. */
  className?: string
  /** Whether to show a blinking cursor at the end of the typed text. Defaults to true. */
  cursor?: boolean
}

/**
 * TypewriterText progressively reveals a text string one character at a time,
 * simulating a typewriter effect. An optional blinking cursor is displayed
 * at the current typing position.
 *
 * @example
 * ```tsx
 * <TypewriterText text="Hello, world!" speed={40} cursor />
 * ```
 */
export default function TypewriterText({
  text,
  speed = 50,
  className,
  cursor = true,
}: TypewriterTextProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) {
      setCharCount(text.length)
      return
    }

    setCharCount(0)

    const interval = setInterval(() => {
      setCharCount((prev) => {
        if (prev >= text.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {text.slice(0, charCount)}
      {cursor && (
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          |
        </motion.span>
      )}
    </span>
  )
}
