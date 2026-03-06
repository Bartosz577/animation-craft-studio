'use client'

import React from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'glow-border'

export const FROZEN_PROMPT = `
[CONTEXT] Glow border hover effect that wraps children in a container with an animated glowing border on hover.
[COMPONENT_SPEC] React component that wraps children in a motion.div with a 1px transparent border. On hover, the border transitions to the glow color and a multi-layered box-shadow glow effect animates in using a spring transition. The glow consists of outer, mid, and inset shadow layers with decreasing opacity.
[ANIMATION_TOKENS] ELEMENT:container TRIGGER:hover TYPE:glow DIRECTION:none STAGGER:false EASING:spring(stiffness:200,damping:20) DURATION:spring LIBRARY:motion STYLE:futuristic
[CODE_CONSTRAINTS] Use motion/react whileHover for animation. CSS variable colors require a resolved hex fallback for boxShadow alpha notation. Default glow color resolves to '#a0ff60'. Border radius is configurable.
[OUTPUT_FORMAT] Single file React component with TypeScript.
[VALIDATION_CRITERIA] Border glows on hover with smooth spring transition. Glow fades out when not hovering. Children render unaffected inside the container.
`

/**
 * Props for the GlowBorder component.
 */
interface GlowBorderProps {
  /** The content to render inside the glowing border container. */
  children: React.ReactNode
  /** Optional CSS class name applied to the motion container. */
  className?: string
  /** The color used for the glow effect. Defaults to 'var(--color-accent)'. When using a CSS variable, a resolved hex is used for boxShadow calculations. */
  glowColor?: string
  /** The border radius of the container. Defaults to '12px'. */
  borderRadius?: string
}

/**
 * Resolves a color value for use in boxShadow with alpha hex notation.
 * CSS variables cannot have alpha appended directly, so we fall back
 * to a known hex value when a var() reference is detected.
 */
function resolveColor(color: string): string {
  if (color.startsWith('var(')) {
    return '#a0ff60'
  }
  return color
}

/**
 * GlowBorder wraps its children in a container that displays
 * an animated glowing border effect on hover. The glow uses
 * multi-layered box shadows for a rich, futuristic look.
 *
 * @example
 * ```tsx
 * <GlowBorder glowColor="#00ffaa" borderRadius="16px">
 *   <div>Card content</div>
 * </GlowBorder>
 * ```
 */
export default function GlowBorder({
  children,
  className,
  glowColor = 'var(--color-accent)',
  borderRadius = '12px',
}: GlowBorderProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const resolvedColor = resolveColor(glowColor)

  if (prefersReducedMotion) {
    return (
      <div
        className={className}
        style={{
          border: '1px solid transparent',
          borderRadius,
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={{
        border: '1px solid transparent',
        borderRadius,
        boxShadow: '0 0 0px transparent',
      }}
      whileHover={{
        boxShadow: `0 0 20px ${resolvedColor}40, 0 0 40px ${resolvedColor}20, inset 0 0 20px ${resolvedColor}10`,
        borderColor: resolvedColor,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
