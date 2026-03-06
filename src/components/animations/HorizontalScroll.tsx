'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export const ANIMATION_ID = 'horizontal-scroll'

export const FROZEN_PROMPT = `
[CONTEXT] Horizontal scroll section that converts vertical scroll into horizontal panel movement.
[COMPONENT_SPEC] React component with an outer section whose height scales with the number of child panels to create scroll room. A sticky inner container (top:0, height:100vh) clips the content. A flex row track translates horizontally based on scroll progress, mapped via useTransform from scrollYProgress [0,1] to translateX [0%, -(100-100/n)%].
[ANIMATION_TOKENS] ELEMENT:section TRIGGER:scroll TYPE:translate DIRECTION:horizontal STAGGER:false EASING:linear DURATION:scroll-bound LIBRARY:motion STYLE:editorial
[CODE_CONSTRAINTS] Use motion/react useScroll with target ref, useTransform for scroll-to-translateX mapping. Each child panel is width:100vw and flex-shrink:0. Outer section height is numPanels * 100vh. Inner container is position:sticky with overflow:hidden.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Vertical scrolling smoothly translates panels horizontally. All panels are reachable. Sticky container remains pinned during scroll.
`

/**
 * Props for the HorizontalScroll component.
 */
interface HorizontalScrollProps {
  /** The panels to display in the horizontal scroll track. Each direct child becomes a full-width panel. */
  children: React.ReactNode
  /** Optional CSS class name applied to the outer section. */
  className?: string
}

/**
 * HorizontalScroll converts vertical scrolling into horizontal panel movement.
 *
 * The component creates an outer section tall enough to provide scroll room
 * proportional to the number of child panels. A sticky inner container
 * remains pinned to the viewport while a flex track translates horizontally
 * based on scroll progress.
 *
 * @example
 * ```tsx
 * <HorizontalScroll>
 *   <div style={{ background: '#1a1a2e' }}>Panel 1</div>
 *   <div style={{ background: '#16213e' }}>Panel 2</div>
 *   <div style={{ background: '#0f3460' }}>Panel 3</div>
 * </HorizontalScroll>
 * ```
 */
export default function HorizontalScroll({
  children,
  className,
}: HorizontalScrollProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const sectionRef = useRef<HTMLElement>(null)
  const numPanels = React.Children.count(children)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const endPercentage = numPanels > 1 ? -(100 - 100 / numPanels) : 0
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${endPercentage}%`]
  )

  if (prefersReducedMotion) {
    return (
      <section className={className}>
        {React.Children.map(children, (child, index) => (
          <div key={index} style={{ width: '100%' }}>
            {child}
          </div>
        ))}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{
        position: 'relative',
        height: `${numPanels * 100}vh`,
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
        <motion.div
          style={{
            display: 'flex',
            x: translateX,
            height: '100%',
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              style={{
                width: '100vw',
                flexShrink: 0,
                height: '100%',
              }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
