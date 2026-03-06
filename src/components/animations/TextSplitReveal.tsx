'use client'

import React from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'text-split-reveal-up'

export const FROZEN_PROMPT = `
[CONTEXT] Text split reveal animation with character-level clipPath animation.
[COMPONENT_SPEC] React component that splits text into individual characters, each animating with clipPath inset(100% 0 0 0) -> inset(0% 0 0 0) and y:20->0 with 0.03s stagger per character. Spaces rendered as-is without clip animation.
[ANIMATION_TOKENS] ELEMENT:text TRIGGER:onLoad TYPE:clip-reveal DIRECTION:up STAGGER:true EASING:expo-out DURATION:medium LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react, motion.span for each character, words wrapped in overflow-hidden inline-block spans. Supports polymorphic rendering via 'as' prop.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Each character reveals from bottom via clipPath with 0.03s stagger. Spaces are preserved without animation artifacts.
`

/**
 * Props for the TextSplitReveal component.
 */
interface TextSplitRevealProps {
  /** The text string to animate character by character. */
  text: string
  /** Optional CSS class name applied to the root element. */
  className?: string
  /** Delay in seconds before the animation begins. Defaults to 0. */
  delay?: number
  /** The HTML element to render as the root. Defaults to 'h1'. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.03,
      delayChildren: delay,
    },
  }),
}

const charVariants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    y: 20,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
    },
  },
}

/**
 * TextSplitReveal splits a text string into individual characters
 * and animates each one into view using a clipPath reveal from below.
 *
 * Words are wrapped in overflow-hidden containers so the clip animation
 * is visually contained. Spaces are rendered as plain spans without animation.
 *
 * @example
 * ```tsx
 * <TextSplitReveal text="Hello World" as="h2" delay={0.3} />
 * ```
 */
export default function TextSplitReveal({
  text,
  className,
  delay = 0,
  as: Tag = 'h1',
}: TextSplitRevealProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  const words = text.split(' ')

  // We need motion on the Tag element. Create a motion component for the tag.
  const MotionTag = motion.create(Tag)

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          style={{ display: 'inline-block', overflow: 'hidden' }}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              variants={charVariants}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </MotionTag>
  )
}
