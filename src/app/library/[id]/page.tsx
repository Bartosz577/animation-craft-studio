'use client'

import { useParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { allAnimations, getAnimationById } from '@/data/animations'
import { getCategoryColor } from '@/lib/dictionary/category-colors'
import ComponentPreview from '@/components/ui/ComponentPreview'
import PropsEditor from '@/components/ui/PropsEditor'
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

const performanceColorMap: Record<string, string> = {
  low: '#34d399',
  medium: '#fbbf24',
  high: '#f87171',
  webgl: '#a78bfa',
}

export default function ComponentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const entry = getAnimationById(id)

  const [propValues, setPropValues] = useState<Record<string, unknown>>(
    () => DEFAULT_PROPS[id] ?? {},
  )
  const [activeTab, setActiveTab] = useState<'motion' | 'code' | 'prompt'>('motion')
  const [previewKey, setPreviewKey] = useState(0)

  const copyToClipboard = useCallback((text: string, msg: string) => {
    navigator.clipboard.writeText(text)
    showToast(msg)
  }, [])

  const handlePropChange = useCallback((key: string, value: unknown) => {
    setPropValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  if (!entry) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'var(--color-background)',
          color: 'var(--color-text-primary)',
        }}
      >
        <p style={{ fontSize: '1.125rem' }}>Komponent nie został znaleziony</p>
        <Link
          href="/library"
          style={{
            color: 'var(--color-accent)',
            fontSize: '0.875rem',
            textDecoration: 'underline',
          }}
        >
          Wróć do biblioteki
        </Link>
      </div>
    )
  }

  const categoryColor = getCategoryColor(entry.category)
  const perfColor = performanceColorMap[entry.config.performance] ?? '#a1a1aa'
  const frozenPrompt = FROZEN_PROMPTS[id] ?? ''

  const tabs: { key: 'motion' | 'code' | 'prompt'; label: string }[] = [
    { key: 'motion', label: 'Frozen Prompt' },
    { key: 'code', label: 'Kod' },
    { key: 'prompt', label: 'Prompt' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* TOP SECTION */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <Link
          href="/library"
          className="text-sm transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          &larr; Component Library
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginTop: '0.75rem',
          }}
        >
          {entry.name.en}
        </h1>

        {/* Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Category badge */}
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: categoryColor + '33',
              color: categoryColor,
            }}
          >
            {entry.category}
          </span>

          {/* Performance badge */}
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: perfColor + '33',
              color: perfColor,
            }}
          >
            {entry.config.performance}
          </span>
        </div>

        <p
          style={{
            color: 'var(--color-text-secondary)',
            maxWidth: '42rem',
            marginTop: '0.75rem',
            lineHeight: 1.6,
          }}
        >
          {entry.description.pl}
        </p>
      </div>

      {/* MAIN SECTION */}
      <div
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        style={{ padding: '0 2rem' }}
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Preview area */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              minHeight: '400px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              position: 'relative',
            }}
          >
            <ComponentPreview
              componentId={id}
              propValues={propValues}
              key={previewKey}
            />
          </div>

          {/* Replay button */}
          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'var(--color-accent)',
              color: '#050505',
              border: 'none',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            Powtórz animację
          </button>

          {/* PropsEditor panel */}
          <div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem',
              }}
            >
              Właściwości
            </h3>
            <div
              className="rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <PropsEditor
                componentId={id}
                propValues={propValues}
                onChange={handlePropChange}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tab bar */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              background: 'var(--color-surface)',
              borderRadius: '0.75rem',
              padding: '0.25rem',
              border: '1px solid var(--color-border)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-4 py-2 text-sm transition-colors"
                  style={{
                    background: isActive ? 'var(--color-accent)' : 'transparent',
                    color: isActive ? '#050505' : 'var(--color-text-secondary)',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: isActive ? 600 : 400,
                    flex: 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div style={{ position: 'relative' }}>
            {activeTab === 'motion' && (
              <>
                <button
                  onClick={() => copyToClipboard(frozenPrompt, 'Prompt skopiowany!')}
                  className="rounded px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    zIndex: 1,
                    background: 'var(--color-surface-elevated, var(--color-surface))',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                  }}
                >
                  Kopiuj
                </button>
                <pre
                  className="text-xs"
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <code>{frozenPrompt}</code>
                </pre>
              </>
            )}

            {activeTab === 'code' && (
              <>
                <button
                  onClick={() => copyToClipboard(entry.code.minimal, 'Kod skopiowany!')}
                  className="rounded px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    zIndex: 1,
                    background: 'var(--color-surface-elevated, var(--color-surface))',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                  }}
                >
                  Kopiuj
                </button>
                <pre
                  className="text-xs"
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <code>{entry.code.minimal}</code>
                </pre>
              </>
            )}

            {activeTab === 'prompt' && (
              <pre
                className="text-xs"
                style={{
                  background: 'var(--color-background)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  fontFamily: 'var(--font-mono)',
                  overflowX: 'auto',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--color-accent)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <code>{entry.prompt.full_prompt}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ padding: '2rem' }}>
        {/* Compatibility */}
        {entry.compatibility.pairs_well_with.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Kompatybilność
            </h3>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              {entry.compatibility.pairs_well_with.map((compatId) => {
                const compatEntry = allAnimations.find((a) => a.id === compatId)
                return (
                  <Link
                    key={compatId}
                    href={`/library/${compatId}`}
                    className="rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                    style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent)'
                      e.currentTarget.style.color = 'var(--color-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    {compatEntry?.name.en ?? compatId}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Performance info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>Performance:</span>
            <span style={{ color: perfColor, fontWeight: 600 }}>
              {entry.config.performance}
            </span>
          </div>

          {/* Frozen Hash */}
          <span
            className="rounded-full px-3 py-1 text-xs"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--color-border)',
            }}
          >
            {entry.prompt.frozen_hash}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
