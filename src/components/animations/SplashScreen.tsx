'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export const ANIMATION_ID = 'splash-screen'

export const FROZEN_PROMPT = `
[CONTEXT] Full-screen splash/loading screen with a timed exit animation.
[COMPONENT_SPEC] React component that renders a fixed full-screen overlay (z-[9999], bg-[#050505]) displaying a centered logo or fallback "ACS" text. After a configurable duration, the overlay exits with a clipPath wipe animation from "inset(0 0 0 0)" to "inset(0 0 0 100%)" over 0.6s. Uses AnimatePresence for mount/unmount transitions. Calls onComplete callback after exit animation finishes.
[ANIMATION_TOKENS] ELEMENT:overlay TRIGGER:timer TYPE:clip-wipe DIRECTION:right STAGGER:false EASING:expo-out DURATION:600ms LIBRARY:motion STYLE:cinematic
[CODE_CONSTRAINTS] Use motion/react AnimatePresence for exit animation. useState tracks visibility, useEffect sets the timer. clipPath animates from full coverage to zero. onAnimationComplete fires the onComplete callback. Fixed positioning with highest z-index.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Splash screen appears on mount, shows logo/text centered, exits with a smooth right-wipe clip after the specified duration, and fires onComplete when done.
`

/**
 * Props for the SplashScreen component.
 */
interface SplashScreenProps {
  /** Callback invoked after the exit animation completes. */
  onComplete?: () => void
  /** Duration in milliseconds the splash screen is visible before the exit animation begins. Defaults to 2000. */
  duration?: number
  /** Optional custom logo element to display. Falls back to styled "ACS" text if not provided. */
  logo?: React.ReactNode
}

/**
 * SplashScreen renders a full-screen loading overlay that automatically
 * exits with a cinematic clip-path wipe animation after a configurable
 * duration. An optional logo can be provided, otherwise "ACS" text is
 * displayed as the default branding.
 *
 * @example
 * ```tsx
 * <SplashScreen
 *   duration={2500}
 *   onComplete={() => console.log('Splash done')}
 *   logo={<img src="/logo.svg" alt="Logo" />}
 * />
 * ```
 */
export default function SplashScreen({
  onComplete,
  duration = 2000,
  logo,
}: SplashScreenProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false)
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setExiting(true)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, prefersReducedMotion, onComplete])

  if (!visible) {
    return null
  }

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="splash"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            clipPath: 'inset(0 0 0 0)',
          }}
          exit={{
            clipPath: 'inset(0 0 0 100%)',
          }}
          transition={{
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1],
          }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit') {
              setVisible(false)
              onComplete?.()
            }
          }}
        >
          {logo ? (
            logo
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: '4rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              ACS
            </span>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="splash-exit"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 100%)' }}
          transition={{
            duration: 0.6,
            ease: [0.19, 1, 0.22, 1],
          }}
          onAnimationComplete={() => {
            setVisible(false)
            onComplete?.()
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {logo ? (
            logo
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: '4rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              ACS
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
