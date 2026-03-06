'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

export const ANIMATION_ID = 'floating-particles'

export const FROZEN_PROMPT = `
[CONTEXT]
A decorative background effect of floating particles that drift up and down continuously.
Pure CSS/React implementation with no canvas or WebGL — each particle is a DOM element
with its own randomized position, size variation, and animation parameters.
Creates an ambient, atmospheric effect suitable for hero sections or background layers.

[COMPONENT_SPEC]
React component that renders N absolutely positioned circular divs inside a relative container.
Each particle has a random initial position (x, y), a random vertical oscillation amplitude,
a random animation duration, and a random opacity between 0.2 and 0.6.
Particles float up and down infinitely using motion.div animate with repeat: Infinity and repeatType: "mirror".
Positions are generated client-side in useEffect to avoid hydration mismatches.

[ANIMATION_TOKENS]
ELEMENT:particles TRIGGER:onMount TYPE:float(y-oscillation) DIRECTION:up+down
STAGGER:none(randomized) EASING:easeInOut DURATION:random(3s-8s)
COUNT:20 SIZE:3px COLOR:var(--color-accent) OPACITY:0.2-0.6
LIBRARY:motion/react STYLE:ambient

[CODE_CONSTRAINTS]
- Use 'motion/react' for all motion imports (NOT framer-motion)
- Pure CSS/React — NO canvas, NO WebGL, NO SVG
- Generate particle positions in useState + useEffect to avoid SSR hydration mismatch
- Container must be position:relative with overflow:hidden
- Each particle is position:absolute, border-radius:50%
- Respect prefers-reduced-motion: render static particles with no animation
- Use CSS custom properties for color where appropriate

[OUTPUT_FORMAT]
Single-file React component with TypeScript, default export + named FROZEN_PROMPT and ANIMATION_ID exports.

[VALIDATION_CRITERIA]
- Particles float smoothly up and down in an infinite loop
- Each particle has randomized position, duration, amplitude, and opacity
- No hydration mismatch between server and client renders
- No canvas or WebGL usage — pure DOM elements
- Container clips particles that drift outside bounds
- No animation plays if prefers-reduced-motion is enabled
`

/**
 * Internal representation of a single particle's randomized parameters.
 */
interface Particle {
  /** Unique identifier. */
  id: number
  /** Horizontal position as a percentage (0-100). */
  x: number
  /** Vertical position as a percentage (0-100). */
  y: number
  /** Vertical oscillation amplitude in pixels. */
  amplitude: number
  /** Animation cycle duration in seconds. */
  duration: number
  /** Particle opacity between 0.2 and 0.6. */
  opacity: number
  /** Random animation delay in seconds to desynchronize particles. */
  delay: number
}

/**
 * Props for the FloatingParticles component.
 */
interface FloatingParticlesProps {
  /** The number of particles to render. Defaults to 20. */
  count?: number
  /** The color of the particles. Accepts any CSS color value. Defaults to 'var(--color-accent)'. */
  color?: string
  /** Optional CSS class name applied to the container. */
  className?: string
  /** The diameter of each particle in pixels. Defaults to 3. */
  size?: number
}

/**
 * FloatingParticles renders a field of small circular elements that float up and down
 * continuously, creating an ambient atmospheric effect. Pure DOM implementation with
 * no canvas or WebGL.
 *
 * @example
 * ```tsx
 * <FloatingParticles count={30} color="#a78bfa" size={4} className="absolute inset-0">
 *   {/* Particles render behind any children *\/}
 * </FloatingParticles>
 * ```
 */
export default function FloatingParticles({
  count = 20,
  color = 'var(--color-accent)',
  className,
  size = 3,
}: FloatingParticlesProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      amplitude: 20 + Math.random() * 40,
      duration: 3 + Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.4,
      delay: Math.random() * 3,
    }))
    setParticles(generated)
  }, [count])

  if (particles.length === 0) {
    return (
      <div
        className={className}
        style={{ position: 'relative', overflow: 'hidden' }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {particles.map((particle) => {
        if (prefersReducedMotion) {
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                opacity: particle.opacity,
                pointerEvents: 'none',
              }}
            />
          )
        }

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: 0,
              y: 0,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -particle.amplitude, 0, particle.amplitude, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: particle.delay,
            }}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: particle.opacity,
              pointerEvents: 'none',
            }}
          />
        )
      })}
    </div>
  )
}
