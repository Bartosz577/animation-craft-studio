'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import type { AnimationEntry } from '@/lib/dictionary'
import { getCategoryColor } from '@/lib/dictionary/category-colors'
import ComponentPreview from '@/components/ui/ComponentPreview'
import { showToast } from '@/components/ui/Toast'

import { FROZEN_PROMPT as HERO_REVEAL_PROMPT } from '@/components/animations/HeroReveal'
import { FROZEN_PROMPT as TEXT_SPLIT_REVEAL_PROMPT } from '@/components/animations/TextSplitReveal'
import { FROZEN_PROMPT as TEXT_SCRAMBLE_PROMPT } from '@/components/animations/TextScramble'
import { FROZEN_PROMPT as MAGNETIC_BUTTON_PROMPT } from '@/components/animations/MagneticButton'
import { FROZEN_PROMPT as PARALLAX_SECTION_PROMPT } from '@/components/animations/ParallaxSection'
import { FROZEN_PROMPT as SCROLL_REVEAL_GRID_PROMPT } from '@/components/animations/ScrollRevealGrid'
import { FROZEN_PROMPT as CURSOR_TRAIL_PROMPT } from '@/components/animations/CursorTrail'
import { FROZEN_PROMPT as PAGE_TRANSITION_PROMPT } from '@/components/animations/PageTransition'
import { FROZEN_PROMPT as FLOATING_PARTICLES_PROMPT } from '@/components/animations/FloatingParticles'
import { FROZEN_PROMPT as GLITCH_TEXT_PROMPT } from '@/components/animations/GlitchText'
import { FROZEN_PROMPT as LIQUID_HOVER_PROMPT } from '@/components/animations/LiquidHover'
import { FROZEN_PROMPT as TILT_CARD_PROMPT } from '@/components/animations/TiltCard'
import { FROZEN_PROMPT as COUNTER_UP_PROMPT } from '@/components/animations/CounterUp'
import { FROZEN_PROMPT as HORIZONTAL_SCROLL_PROMPT } from '@/components/animations/HorizontalScroll'
import { FROZEN_PROMPT as PIN_SECTION_PROMPT } from '@/components/animations/PinSection'
import { FROZEN_PROMPT as TYPEWRITER_TEXT_PROMPT } from '@/components/animations/TypewriterText'
import { FROZEN_PROMPT as GLOW_BORDER_PROMPT } from '@/components/animations/GlowBorder'
import { FROZEN_PROMPT as STAGGER_LIST_PROMPT } from '@/components/animations/StaggerList'
import { FROZEN_PROMPT as SPLASH_SCREEN_PROMPT } from '@/components/animations/SplashScreen'
import { FROZEN_PROMPT as MORPHING_SHAPE_PROMPT } from '@/components/animations/MorphingShape'

const FROZEN_PROMPTS: Record<string, string> = {
  'hero-sequence': HERO_REVEAL_PROMPT,
  'text-split-reveal-up': TEXT_SPLIT_REVEAL_PROMPT,
  'text-scramble': TEXT_SCRAMBLE_PROMPT,
  'magnetic-button': MAGNETIC_BUTTON_PROMPT,
  'parallax-image': PARALLAX_SECTION_PROMPT,
  'stagger-grid-reveal': SCROLL_REVEAL_GRID_PROMPT,
  'cursor-trail': CURSOR_TRAIL_PROMPT,
  'page-transition': PAGE_TRANSITION_PROMPT,
  'floating-particles': FLOATING_PARTICLES_PROMPT,
  'glitch-text': GLITCH_TEXT_PROMPT,
  'liquid-hover': LIQUID_HOVER_PROMPT,
  'tilt-3d-card': TILT_CARD_PROMPT,
  'counter-up': COUNTER_UP_PROMPT,
  'horizontal-scroll': HORIZONTAL_SCROLL_PROMPT,
  'pin-section': PIN_SECTION_PROMPT,
  'typewriter-text': TYPEWRITER_TEXT_PROMPT,
  'glow-border': GLOW_BORDER_PROMPT,
  'stagger-list': STAGGER_LIST_PROMPT,
  'splash-screen': SPLASH_SCREEN_PROMPT,
  'morphing-shape': MORPHING_SHAPE_PROMPT,
}

const DEFAULT_PROPS: Record<string, Record<string, unknown>> = {
  'hero-sequence': { delay: 0 },
  'text-split-reveal-up': { text: 'Animation Craft', delay: 0, as: 'h1' },
  'text-scramble': { text: 'DECODE', trigger: 'mount' },
  'magnetic-button': { strength: 0.4 },
  'parallax-image': { speed: 0.3, direction: 'up' },
  'stagger-grid-reveal': { staggerDelay: 0.08 },
  'cursor-trail': { color: '#a0ff60', size: 8, count: 8 },
  'page-transition': {},
  'floating-particles': { count: 20, color: '#a0ff60', size: 3 },
  'glitch-text': { text: 'GLITCH', active: true },
  'liquid-hover': { fillColor: '#a0ff60' },
  'tilt-3d-card': { maxTilt: 15 },
  'counter-up': { target: 1234, suffix: '+', prefix: '', duration: 2 },
  'horizontal-scroll': {},
  'pin-section': {},
  'typewriter-text': { text: 'Hello, World!', speed: 50, cursor: true },
  'glow-border': { glowColor: '#a0ff60', borderRadius: '12px' },
  'stagger-list': { staggerDelay: 0.1, direction: 'up' },
  'splash-screen': { duration: 2000 },
  'morphing-shape': { color: '#a0ff60', animate: true },
}

interface ComponentCardProps {
  entry: AnimationEntry
}

export default function ComponentCard({ entry }: ComponentCardProps) {
  const [playKey, setPlayKey] = useState(0)
  const categoryColor = getCategoryColor(entry.category)

  // Auto-replay loop every 3s to keep card previews alive
  useEffect(() => {
    const iv = setInterval(() => setPlayKey((k) => k + 1), 3000)
    return () => clearInterval(iv)
  }, [])

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(entry.code.minimal)
    showToast('Kod skopiowany!')
  }, [entry.code.minimal])

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(FROZEN_PROMPTS[entry.id] ?? '')
    showToast('Prompt skopiowany!')
  }, [entry.id])

  const performanceColor =
    entry.config.performance === 'low'
      ? '#34d399'
      : entry.config.performance === 'medium'
        ? '#fbbf24'
        : entry.config.performance === 'high'
          ? '#f87171'
          : '#e879f9'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Preview area */}
      <div
        style={{
          height: '12rem',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--color-background)',
        }}
      >
        <ComponentPreview
          key={playKey}
          componentId={entry.id}
          propValues={DEFAULT_PROPS[entry.id] ?? {}}
          mode="card"
        />
      </div>

      {/* Info area */}
      <div style={{ padding: '1rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1rem',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {entry.name.en}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: categoryColor,
              background: `${categoryColor}18`,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            {entry.category}
          </span>

          <span
            title={`Performance: ${entry.config.performance}`}
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              background: performanceColor,
              flexShrink: 0,
            }}
          />
        </div>

        {/* Action bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            marginTop: '0.75rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={handleCopyCode}
            style={{
              fontSize: '0.75rem',
              padding: '0.375rem 0.75rem',
              background: 'var(--color-surface-elevated)',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Copy Code
          </button>
          <button
            onClick={handleCopyPrompt}
            style={{
              fontSize: '0.75rem',
              padding: '0.375rem 0.75rem',
              background: 'var(--color-surface-elevated)',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Copy Prompt
          </button>
          <Link
            href={`/library/${entry.id}`}
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-accent)',
              marginLeft: 'auto',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
