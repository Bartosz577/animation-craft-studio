'use client'

import React, { useEffect, useState, useRef } from 'react'

export const ANIMATION_ID = 'glitch-text'

export const FROZEN_PROMPT = `
[CONTEXT]
A glitch text effect that renders text with two offset color-shifted copies that
randomly clip and shift, creating a digital distortion / data corruption visual.
Commonly used for cyberpunk aesthetics, error states, or edgy hero text.

[COMPONENT_SPEC]
React component that renders the text string 3 times layered on top of each other:
- Original text: relatively positioned, serves as the base readable layer.
- Copy 1: absolutely positioned, colored rgba(255,0,0,0.7), translated +2px on X axis,
  with a randomly changing clipPath inset to create horizontal slice glitches.
- Copy 2: absolutely positioned, colored rgba(0,0,255,0.7), translated -2px on X axis,
  with a different randomly changing clipPath inset.
A setInterval (100ms) randomly updates the clipPath values for both copies,
generating values like inset(y1% 0 y2% 0) where y1 and y2 are random percentages.
The effect can be toggled on/off via the active prop.

[ANIMATION_TOKENS]
ELEMENT:text-copies TRIGGER:active(prop) TYPE:glitch(clipPath+translate) DIRECTION:horizontal
STAGGER:none EASING:step(discrete) INTERVAL:100ms
COLORS:rgba(255,0,0,0.7)+rgba(0,0,255,0.7) LIBRARY:pure-react STYLE:cyberpunk

[CODE_CONSTRAINTS]
- Pure React + CSS — no animation library needed for this effect
- Use useEffect + setInterval for random clipPath updates
- Clean up interval on unmount or when active becomes false
- Container needs position:relative and overflow:hidden
- Copies need position:absolute, inset:0 for perfect overlay
- Respect prefers-reduced-motion: render plain text with no glitch copies
- Use mix-blend-mode or simple opacity for the color overlay effect

[OUTPUT_FORMAT]
Single-file React component with TypeScript, default export + named FROZEN_PROMPT and ANIMATION_ID exports.

[VALIDATION_CRITERIA]
- Glitch effect shows two color-shifted copies with random clip-path slices
- ClipPath values update every 100ms when active
- Effect stops cleanly when active=false or component unmounts
- No animation or copies render when prefers-reduced-motion is enabled
- Text remains readable through the glitch effect
- No memory leaks from uncleared intervals
`

/**
 * Props for the GlitchText component.
 */
interface GlitchTextProps {
  /** The text string to render with the glitch effect. */
  text: string
  /** Optional CSS class name applied to the container span. */
  className?: string
  /** Whether the glitch effect is active. Defaults to true. */
  active?: boolean
}

/**
 * GlitchText renders text with a digital distortion effect using two
 * color-shifted, randomly clipped copies overlaid on the original text.
 * The copies shift horizontally and have random horizontal slice clip-paths
 * that update every 100ms, creating a continuous glitch aesthetic.
 *
 * @example
 * ```tsx
 * <GlitchText
 *   text="SYSTEM ERROR"
 *   className="text-4xl font-bold text-white"
 *   active={true}
 * />
 * ```
 */
export default function GlitchText({
  text,
  className,
  active = true,
}: GlitchTextProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [clip1, setClip1] = useState('inset(0% 0 100% 0)')
  const [clip2, setClip2] = useState('inset(0% 0 100% 0)')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (prefersReducedMotion || !active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      const y1a = Math.random() * 100
      const y1b = Math.random() * 100
      const top1 = Math.min(y1a, y1b)
      const bottom1 = 100 - Math.max(y1a, y1b)

      const y2a = Math.random() * 100
      const y2b = Math.random() * 100
      const top2 = Math.min(y2a, y2b)
      const bottom2 = 100 - Math.max(y2a, y2b)

      setClip1(`inset(${top1}% 0 ${bottom1}% 0)`)
      setClip2(`inset(${top2}% 0 ${bottom2}% 0)`)
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [active, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
      }}
    >
      {/* Base text layer */}
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>

      {/* Glitch copy 1: red shifted right */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            color: 'rgba(255, 0, 0, 0.7)',
            transform: 'translateX(2px)',
            clipPath: clip1,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}

      {/* Glitch copy 2: blue shifted left */}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            color: 'rgba(0, 0, 255, 0.7)',
            transform: 'translateX(-2px)',
            clipPath: clip2,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  )
}
