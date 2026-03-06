'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react'

export const ANIMATION_ID = 'pin-section'

export const FROZEN_PROMPT = `
[CONTEXT] Pinned section with scroll-driven progress that supports render props for scrub content.
[COMPONENT_SPEC] React component with an outer section (min-height:200vh) providing scroll room and an inner sticky container (top:0, height:100vh) that pins content. Uses useScroll to track progress from 0 to 1. Supports scrubContent as either a ReactNode (faded in by progress) or a render function receiving the progress value for custom scroll-driven animations.
[ANIMATION_TOKENS] ELEMENT:section TRIGGER:scroll TYPE:pin DIRECTION:vertical STAGGER:false EASING:linear DURATION:scroll-bound LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react useScroll with target ref and offset ["start start", "end end"]. useTransform maps scrollYProgress to a 0-1 number. useMotionValueEvent tracks progress changes and passes value to render prop function. If scrubContent is a ReactNode, wrap it in a motion.div with opacity linked to progress. Children are always rendered as the main pinned content.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Section pins correctly during scroll. Progress value accurately reflects scroll position from 0 to 1. Render prop receives continuous progress updates. Static scrubContent fades in proportionally.
`

/**
 * Props for the PinSection component.
 */
interface PinSectionProps {
  /** The main content that remains pinned during scroll. */
  children: React.ReactNode
  /** Optional CSS class name applied to the outer section. */
  className?: string
  /** Additional content driven by scroll progress. Pass a ReactNode for opacity-based reveal, or a function receiving progress (0-1) for custom scroll-driven rendering. */
  scrubContent?: React.ReactNode | ((progress: number) => React.ReactNode)
}

/**
 * PinSection creates a scroll-pinned section with scrub-driven content.
 *
 * The outer section provides vertical scroll room (min-height: 200vh) while
 * the inner container sticks to the viewport. Scroll progress (0 to 1) can
 * drive additional content via a render prop function or a simple ReactNode
 * that fades in with scroll.
 *
 * @example
 * ```tsx
 * // With render prop
 * <PinSection scrubContent={(progress) => (
 *   <div style={{ transform: `scale(${0.5 + progress * 0.5})` }}>
 *     {Math.round(progress * 100)}%
 *   </div>
 * )}>
 *   <h2>Pinned Title</h2>
 * </PinSection>
 *
 * // With static content
 * <PinSection scrubContent={<p>Fades in as you scroll</p>}>
 *   <h2>Pinned Title</h2>
 * </PinSection>
 * ```
 */
export default function PinSection({
  children,
  className,
  scrubContent,
}: PinSectionProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v)
  })

  if (prefersReducedMotion) {
    return (
      <section className={className}>
        {children}
        {scrubContent && (
          <div>
            {typeof scrubContent === 'function'
              ? scrubContent(1)
              : scrubContent}
          </div>
        )}
      </section>
    )
  }

  const isScrubFunction = typeof scrubContent === 'function'

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position: 'relative',
        minHeight: '200vh',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {children}
        {scrubContent && (
          <>
            {isScrubFunction ? (
              <div>{scrubContent(progress)}</div>
            ) : (
              <motion.div style={{ opacity }}>
                {scrubContent}
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
