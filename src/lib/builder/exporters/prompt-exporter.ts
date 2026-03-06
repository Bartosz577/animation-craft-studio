import type { Block, AnimationTheme } from '@/lib/stores/builder-store'
import type { FrozenPrompt } from '@/lib/prompt-engine'
import { allAnimations } from '@/data/animations'

export const COMPONENT_NAME_MAP: Record<string, string> = {
  'hero-sequence': 'HeroReveal',
  'text-split-reveal-up': 'TextSplitReveal',
  'text-scramble': 'TextScramble',
  'magnetic-button': 'MagneticButton',
  'parallax-image': 'ParallaxSection',
  'stagger-grid-reveal': 'ScrollRevealGrid',
  'cursor-trail': 'CursorTrail',
  'page-transition': 'PageTransition',
  'floating-particles': 'FloatingParticles',
  'glitch-text': 'GlitchText',
  'liquid-hover': 'LiquidHover',
  'tilt-3d-card': 'TiltCard',
  'counter-up': 'CounterUp',
  'horizontal-scroll': 'HorizontalScroll',
  'pin-section': 'PinSection',
  'typewriter-text': 'TypewriterText',
  'glow-border': 'GlowBorder',
  'stagger-list': 'StaggerList',
  'splash-screen': 'SplashScreen',
  'morphing-shape': 'MorphingShape',
}

function getThemeDescription(theme: AnimationTheme): string {
  const map: Record<AnimationTheme, string> = {
    minimal: 'fast durations, expo-out easing, no stagger',
    bold: 'medium durations, spring easing, stagger enabled',
    editorial: 'slow durations, expo-out easing, clip reveals',
    luxury: 'dramatic durations, ease-in-out-quart, maximum elegance',
  }
  return map[theme]
}

export async function exportMasterPrompt(
  blocks: Block[],
  theme: AnimationTheme,
): Promise<FrozenPrompt> {
  const entries = blocks.map((b) =>
    allAnimations.find((e) => e.id === b.componentId),
  )

  const sections = {
    CONTEXT: `Framework: Next.js 16.1
Libraries: motion v12, gsap 3, lenis 1.x
TypeScript: yes
Animation Theme: ${theme}
Target: Complete landing page with ${blocks.length} animation blocks.
Theme timing: ${getThemeDescription(theme)}`,

    COMPONENT_SPEC: `Page structure — ${blocks.length} blocks in order:
${blocks
  .map((b, i) => {
    const entry = entries[i]
    const name = COMPONENT_NAME_MAP[b.componentId] ?? b.componentId
    const delay =
      b.animationConfig.delay > 0
        ? ` (delay: ${b.animationConfig.delay}ms)`
        : ''
    const disabled = b.animationConfig.disabled
      ? ' [ANIMATION DISABLED]'
      : ''
    return `${i + 1}. ${name}${delay}${disabled}
   Props: ${JSON.stringify(b.props)}
   Element: ${entry?.tokens.element ?? 'unknown'}`
  })
  .join('\n\n')}`,

    ANIMATION_TOKENS: `Global theme: ${theme.toUpperCase()}
${blocks
  .map((b, i) => {
    const entry = entries[i]
    const name = COMPONENT_NAME_MAP[b.componentId] ?? b.componentId
    return `--- ${name} ---
ELEMENT: ${entry?.tokens.element ?? 'unknown'}
TRIGGER: ${b.animationConfig.triggerOverride ?? entry?.tokens.trigger ?? 'unknown'}
TYPE: ${entry?.tokens.type ?? 'unknown'}
DIRECTION: ${entry?.tokens.direction ?? 'none'}
STAGGER: ${entry?.tokens.stagger ?? false}
EASING: ${entry?.tokens.easing ?? 'ease-out'}
DURATION: ${b.animationConfig.durationOverride ?? entry?.tokens.duration ?? 'medium'}
LIBRARY: ${entry?.tokens.library ?? 'motion'}
STYLE: ${entry?.tokens.style ?? 'minimal'}`
  })
  .join('\n\n')}`,

    VISUAL_REFERENCE: `Complete page visual experience:
The page consists of ${blocks.length} sections stacked vertically.
${blocks
  .map((b, i) => {
    const entry = entries[i]
    const name = COMPONENT_NAME_MAP[b.componentId] ?? b.componentId
    return `Section ${i + 1} (${name}): ${entry?.description.en ?? ''}`
  })
  .join('\n')}

After all animations complete: all elements are fully visible,
at rest, at their natural positions in the layout.`,

    CODE_CONSTRAINTS: `- Implement each component in a single page.tsx file
- Use CSS custom properties for all timing: var(--duration-*), var(--ease-*)
- All animations must respect prefers-reduced-motion
- GSAP: register plugins in useEffect, kill in cleanup
- No TypeScript any types
- Each section wrapped in <section> with semantic HTML
- Mobile responsive: all animations work on touch devices`,

    OUTPUT_FORMAT: `Return a single /app/page.tsx file:
1. "use client" directive at top
2. All component imports
3. Theme constants
4. Default export GeneratedPage component
5. Each block as a <section> with the animation component
6. Named export: export const MASTER_FROZEN_HASH = '{hash}'`,

    VALIDATION_CRITERIA: `All ${blocks.length} components render without errors
Animations trigger at correct scroll/load/hover events
No console errors or TypeScript errors
prefers-reduced-motion: all animations skipped
Mobile: touch events work for hover-based animations
Performance: no layout shift after animations complete`,
  }

  const fullPrompt = Object.entries(sections)
    .map(([key, value]) => `[${key}]\n${value}`)
    .join('\n\n---\n\n')

  const encoder = new TextEncoder()
  const data = encoder.encode(sections.ANIMATION_TOKENS)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const frozenHash = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 12)

  return {
    sections,
    fullPrompt,
    frozenHash,
    generatedAt: new Date().toISOString(),
    version: '1.0',
    entryId: `master-${blocks.length}-blocks`,
  }
}
