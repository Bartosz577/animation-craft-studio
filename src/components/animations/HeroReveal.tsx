'use client'

import React from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'hero-sequence'

export const FROZEN_PROMPT = `
[CONTEXT] Hero entrance sequence with staggered children reveal.
[COMPONENT_SPEC] React component wrapping children, each child animates y:60->0, opacity:0->1, blur:8px->0.
[ANIMATION_TOKENS] ELEMENT:hero TRIGGER:onLoad TYPE:fade DIRECTION:up STAGGER:true EASING:expo-out DURATION:medium LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react variants, staggerChildren pattern.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] All children animate in sequence with 0.15s stagger.
`

/**
 * Props for the HeroReveal component.
 */
interface HeroRevealProps {
  /** The content to reveal with a staggered animation sequence. Each direct child animates individually. */
  children: React.ReactNode
  /** Optional CSS class name applied to the outer container. */
  className?: string
  /** Delay in seconds before the animation sequence begins. Defaults to 0. */
  delay?: number
}

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.15,
      delayChildren: delay,
    },
  }),
}

const childVariants = {
  hidden: {
    y: 60,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
    },
  },
}

/**
 * HeroReveal wraps hero content and staggers each direct child into view
 * with a upward slide, fade, and blur-clear animation.
 *
 * @example
 * ```tsx
 * <HeroReveal delay={0.2}>
 *   <h1>Welcome</h1>
 *   <p>Subtitle text</p>
 *   <button>Get Started</button>
 * </HeroReveal>
 * ```
 */
export default function HeroReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
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
      animate="visible"
      custom={delay}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
