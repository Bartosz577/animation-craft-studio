'use client'

import React from 'react'
import HeroReveal from '@/components/animations/HeroReveal'
import TextSplitReveal from '@/components/animations/TextSplitReveal'
import TextScramble from '@/components/animations/TextScramble'
import MagneticButton from '@/components/animations/MagneticButton'
import ParallaxSection from '@/components/animations/ParallaxSection'
import ScrollRevealGrid from '@/components/animations/ScrollRevealGrid'
import CursorTrail from '@/components/animations/CursorTrail'
import PageTransition from '@/components/animations/PageTransition'
import FloatingParticles from '@/components/animations/FloatingParticles'
import GlitchText from '@/components/animations/GlitchText'
import LiquidHover from '@/components/animations/LiquidHover'
import TiltCard from '@/components/animations/TiltCard'
import CounterUp from '@/components/animations/CounterUp'
import HorizontalScroll from '@/components/animations/HorizontalScroll'
import PinSection from '@/components/animations/PinSection'
import TypewriterText from '@/components/animations/TypewriterText'
import GlowBorder from '@/components/animations/GlowBorder'
import StaggerList from '@/components/animations/StaggerList'
import SplashScreen from '@/components/animations/SplashScreen'
import MorphingShape from '@/components/animations/MorphingShape'

interface ComponentPreviewProps {
  componentId: string
  propValues: Record<string, unknown>
  className?: string
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#ef4444',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: 600 }}>Render error</p>
            <p style={{ color: '#a1a1aa', maxWidth: '300px' }}>{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              style={{
                marginTop: '0.25rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #3f3f46',
                background: '#27272a',
                color: '#e4e4e7',
                cursor: 'pointer',
              }}
            >
              Spróbuj ponownie
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

function renderComponent(id: string, props: Record<string, unknown>) {
  switch (id) {
    case 'hero-sequence':
      return (
        <HeroReveal {...props}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Welcome</h1>
          <p style={{ fontSize: '1.125rem', color: '#a1a1aa' }}>Subtitle text</p>
          <button
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--color-accent, #a0ff60)',
              color: '#000',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </HeroReveal>
      )

    case 'text-split-reveal-up':
      return (
        <TextSplitReveal
          text={(props.text as string) || 'Animation Craft'}
          {...props}
        />
      )

    case 'text-scramble':
      return (
        <TextScramble
          text={(props.text as string) || 'DECODE'}
          {...props}
        />
      )

    case 'magnetic-button':
      return (
        <MagneticButton {...props}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              background: 'var(--color-accent, #a0ff60)',
              color: '#000',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Click me
          </span>
        </MagneticButton>
      )

    case 'parallax-image':
      return (
        <ParallaxSection {...props}>
          <div
            style={{
              height: '16rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            }}
          />
        </ParallaxSection>
      )

    case 'stagger-grid-reveal':
      return (
        <ScrollRevealGrid {...props}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                background: '#27272a',
                border: '1px solid #3f3f46',
                color: '#e4e4e7',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              Card {i + 1}
            </div>
          ))}
        </ScrollRevealGrid>
      )

    case 'cursor-trail':
      return (
        <CursorTrail {...props}>
          <div
            style={{
              height: '12rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a1a1aa',
              fontSize: '0.875rem',
              userSelect: 'none',
            }}
          >
            Move your cursor here
          </div>
        </CursorTrail>
      )

    case 'page-transition':
      return (
        <PageTransition {...props}>
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#e4e4e7',
              fontSize: '1rem',
            }}
          >
            Page Content
          </div>
        </PageTransition>
      )

    case 'floating-particles':
      return (
        <FloatingParticles
          className="w-full"
          {...props}
          {...({ style: { minHeight: '200px' } } as Record<string, unknown>)}
        />
      )

    case 'glitch-text':
      return (
        <GlitchText
          text={(props.text as string) || 'GLITCH'}
          {...props}
        />
      )

    case 'liquid-hover':
      return (
        <LiquidHover {...props}>
          <div
            style={{
              padding: '1rem 2rem',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Hover me
          </div>
        </LiquidHover>
      )

    case 'tilt-3d-card':
      return (
        <TiltCard {...props}>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: '#27272a',
              border: '1px solid #3f3f46',
            }}
          >
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '0.5rem',
              }}
            >
              Interactive Card
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
              Move your mouse over me
            </p>
          </div>
        </TiltCard>
      )

    case 'counter-up':
      return (
        <CounterUp
          target={(props.target as number) || 1234}
          {...props}
        />
      )

    case 'horizontal-scroll':
      return (
        <HorizontalScroll {...props}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a1a2e',
              color: '#e4e4e7',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            Panel 1
          </div>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#16213e',
              color: '#e4e4e7',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            Panel 2
          </div>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0f3460',
              color: '#e4e4e7',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            Panel 3
          </div>
        </HorizontalScroll>
      )

    case 'pin-section':
      return (
        <PinSection {...props}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Pinned Content
            </h2>
          </div>
        </PinSection>
      )

    case 'typewriter-text':
      return (
        <TypewriterText
          text={(props.text as string) || 'Hello, World!'}
          {...props}
        />
      )

    case 'glow-border':
      return (
        <GlowBorder {...props}>
          <div
            style={{
              padding: '1.25rem 1.5rem',
              color: '#e4e4e7',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            Hover for glow
          </div>
        </GlowBorder>
      )

    case 'stagger-list':
      return (
        <StaggerList {...props}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#27272a',
                border: '1px solid #3f3f46',
                color: '#e4e4e7',
                fontSize: '0.875rem',
              }}
            >
              List item {i + 1}
            </div>
          ))}
        </StaggerList>
      )

    case 'splash-screen':
      return (
        <SplashScreen
          duration={(props.duration as number) ?? 2000}
          onComplete={() => {}}
          {...props}
        />
      )

    case 'morphing-shape':
      return <MorphingShape {...props} />

    default:
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#71717a',
            fontSize: '0.875rem',
          }}
        >
          Unknown component: {id}
        </div>
      )
  }
}

export default function ComponentPreview({
  componentId,
  propValues,
  className,
}: ComponentPreviewProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surface, #18181b)',
        borderRadius: '0.75rem',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ErrorBoundary>
        {renderComponent(componentId, propValues)}
      </ErrorBoundary>
    </div>
  )
}
