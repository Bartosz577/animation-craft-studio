'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'motion/react'

export const ANIMATION_ID = 'text-scramble'

export const FROZEN_PROMPT = `
[CONTEXT] Text scramble effect that cycles through random characters before revealing the final text.
[COMPONENT_SPEC] React component that takes a text string and scrambles it character by character, resolving each character sequentially. Supports mount, hover, and inView trigger modes.
[ANIMATION_TOKENS] ELEMENT:text TRIGGER:onLoad|onHover|inView TYPE:scramble DIRECTION:none STAGGER:true EASING:linear DURATION:dynamic LIBRARY:react STYLE:glitch
[CODE_CONSTRAINTS] Pure React state + setInterval, no external animation library needed. Uses useInView from motion/react for inView trigger. Character pool: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Each character resolves after (index * 50)ms. Random characters cycle until resolved. All three trigger modes work correctly.
`

const CHARS_POOL =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

/**
 * Props for the TextScramble component.
 */
interface TextScrambleProps {
  /** The target text to reveal through the scramble effect. */
  text: string
  /** Optional CSS class name applied to the wrapping span. */
  className?: string
  /**
   * Determines when the scramble animation triggers.
   * - 'mount': starts immediately on component mount
   * - 'hover': starts on mouse enter
   * - 'inView': starts when the element enters the viewport
   * Defaults to 'mount'.
   */
  trigger?: 'mount' | 'hover' | 'inView'
}

/**
 * TextScramble displays text with a scramble/decode effect where random
 * characters cycle rapidly before each letter resolves to its final value.
 *
 * @example
 * ```tsx
 * <TextScramble text="Hello World" trigger="inView" />
 * ```
 */
export default function TextScramble({
  text,
  className,
  trigger = 'mount',
}: TextScrambleProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [displayText, setDisplayText] = useState(
    prefersReducedMotion ? text : ''
  )
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const iterationRef = useRef(0)
  const containerRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(containerRef, { once: true })

  const startScramble = useCallback(() => {
    if (prefersReducedMotion || isScrambling) return

    setIsScrambling(true)
    iterationRef.current = 0

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1
      const currentIteration = iterationRef.current

      const result = text
        .split('')
        .map((char, index) => {
          // Preserve spaces
          if (char === ' ') return ' '

          // Character is resolved when enough iterations have passed
          const resolveAt = Math.ceil((index * 50) / 30)
          if (currentIteration >= resolveAt) {
            return char
          }

          // Return random character
          return CHARS_POOL[Math.floor(Math.random() * CHARS_POOL.length)]
        })
        .join('')

      setDisplayText(result)

      // Check if all characters are resolved
      const lastCharResolveAt = Math.ceil(((text.length - 1) * 50) / 30)
      if (currentIteration >= lastCharResolveAt) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text, prefersReducedMotion, isScrambling])

  // Mount trigger
  useEffect(() => {
    if (trigger === 'mount' && !prefersReducedMotion) {
      startScramble()
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, prefersReducedMotion])

  // InView trigger
  useEffect(() => {
    if (trigger === 'inView' && isInView && !prefersReducedMotion) {
      startScramble()
    }
  }, [trigger, isInView, prefersReducedMotion, startScramble])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      startScramble()
    }
  }

  if (prefersReducedMotion) {
    return (
      <span className={className} ref={containerRef}>
        {text}
      </span>
    )
  }

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayText || (trigger !== 'mount' ? text : '\u00A0'.repeat(text.length))}
    </span>
  )
}
