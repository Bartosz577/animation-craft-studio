import type { AnimationEntry } from '@/lib/dictionary'

export const counterUp: AnimationEntry = {
  id: 'counter-up',
  name: { pl: 'Licznik w górę — animacja wartości', en: 'Counter Up' },
  category: 'scroll',
  subcategory: 'counter',
  tags: ['counter', 'licznik', 'number', 'scroll', 'statystyka', 'value'],
  description: {
    pl: 'Wartość liczbowa animuje się od zera do docelowej wartości po wejściu w viewport. Idealny do statystyk i KPI.',
    en: 'Number animates from 0 to target value when scrolled into view.',
    technical: 'Motion: useInView trigger, useSpring from 0 to target, useMotionValueEvent for display update',
  },
  preview: { component: 'CounterUp', thumbnail: '/thumbnails/counter-up.webp' },
  code: {
    minimal: `'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useSpring, useMotionValue } from 'motion/react'

export function CounterUp({ target = 100, suffix = '' }: { target?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, target, motionValue])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(Math.floor(v))
    })
    return unsubscribe
  }, [spring])

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {display}{suffix}
    </span>
  )
}`,
    full: `'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useSpring, useMotionValue } from 'motion/react'

interface CounterUpProps {
  target: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
  stiffness?: number
  damping?: number
}

export function CounterUp({
  target,
  suffix = '',
  prefix = '',
  className,
  decimals = 0,
  stiffness = 50,
  damping = 20,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness, damping })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) motionValue.set(target)
  }, [isInView, target, motionValue])

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(v.toFixed(decimals))
    })
    return unsubscribe
  }, [spring, decimals])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}{display}{suffix}
    </span>
  )
}`,
    storybook_story: `import type { Meta, StoryObj } from '@storybook/react'
import { CounterUp } from '@/data/animations/counter-up'

const meta: Meta<typeof CounterUp> = {
  title: 'Animations/Scroll/CounterUp',
  component: CounterUp,
  args: { target: 1234, suffix: '+' },
}

export default meta
type Story = StoryObj<typeof CounterUp>

export const Default: Story = {}
export const WithPrefix: Story = { args: { prefix: '$', target: 99, suffix: 'M' } }`,
  },
  prompt: {
    fragment: 'Number counts up from 0 to target on view',
    full_prompt: '[CONTEXT] Statistics section [COMPONENT_SPEC] Animated counter from 0 to target [ANIMATION_TOKENS] element:text trigger:onView type:fade direction:none stagger:false easing:ease-out duration:slow library:motion style:minimal [VISUAL_REFERENCE] Number rolls up like odometer [CODE_CONSTRAINTS] Motion useSpring, useInView [OUTPUT_FORMAT] React component [VALIDATION_CRITERIA] Smooth deceleration at target, tabular-nums',
    frozen_hash: 'cu-k7l8m9n0',
  },
  tokens: {
    element: 'text',
    trigger: 'onView',
    type: 'fade',
    direction: 'none',
    stagger: false,
    easing: 'ease-out',
    duration: 'slow',
    library: 'motion',
    style: 'minimal',
  },
  libraries: [{ name: 'motion', version: '>=12.0.0', required: true }],
  config: { intensity: 2, performance: 'low' },
  compatibility: {
    pairs_well_with: ['slide-up-fade', 'stagger-grid-reveal', 'hero-sequence'],
    conflicts_with: ['text-scramble'],
  },
  examples: [
    { site: 'Stripe', url: 'https://stripe.com/customers', screenshot: '/examples/stripe-counter.webp' },
  ],
}
