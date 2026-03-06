import type { AnimationLibrary } from '@/lib/dictionary'
import type { Match } from './slot-mapper'

export type UserContext = {
  framework: 'nextjs' | 'react' | 'astro' | 'vue'
  frameworkVersion: string
  typescript: boolean
  tailwindVersion: '3' | '4'
  preferredLibrary: AnimationLibrary
}

export type FrozenPrompt = {
  sections: {
    CONTEXT: string
    COMPONENT_SPEC: string
    ANIMATION_TOKENS: string
    VISUAL_REFERENCE: string
    CODE_CONSTRAINTS: string
    OUTPUT_FORMAT: string
    VALIDATION_CRITERIA: string
  }
  fullPrompt: string
  frozenHash: string
  generatedAt: string
  version: string
  entryId: string
}

// ---------------------------------------------------------------------------
// Duration map
// ---------------------------------------------------------------------------

const durationMs: Record<string, number> = {
  fast: 300,
  medium: 600,
  slow: 1000,
  dramatic: 1500,
}

// ---------------------------------------------------------------------------
// Performance advice
// ---------------------------------------------------------------------------

const perfAdvice: Record<string, string> = {
  low: 'This is a lightweight animation — no special performance considerations needed.',
  medium:
    'Use will-change on animated properties. Prefer transform/opacity over layout-triggering properties.',
  high: 'Debounce scroll handlers. Use IntersectionObserver over continuous polling. Consider reducing particles on mobile.',
  webgl:
    'Wrap in React.lazy with Suspense. Dispose geometries and materials in cleanup. Provide a static fallback for SSR.',
}

// ---------------------------------------------------------------------------
// Trigger condition descriptions
// ---------------------------------------------------------------------------

const triggerConditions: Record<string, string> = {
  onLoad: 'the component mounts (page load)',
  onScroll: 'the user scrolls and the element enters the scroll trigger zone',
  onHover: 'the user hovers over the element',
  onClick: 'the user clicks the element',
  onView: 'the element enters the viewport (IntersectionObserver / useInView)',
  onLeave: 'the element leaves the viewport',
}

// ---------------------------------------------------------------------------
// Hash helper
// ---------------------------------------------------------------------------

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 12)
}

// ---------------------------------------------------------------------------
// PascalCase helper
// ---------------------------------------------------------------------------

function toPascalCase(str: string): string {
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export async function buildFrozenPrompt(
  match: Match,
  context: UserContext,
): Promise<FrozenPrompt> {
  const { entry } = match
  const t = entry.tokens
  const componentName = toPascalCase(entry.id)

  // --- CONTEXT ---
  const CONTEXT = `Framework: ${context.framework} ${context.frameworkVersion}
Libraries: ${t.library} (primary), motion v12 (UI), tailwind v${context.tailwindVersion}
TypeScript: ${context.typescript ? 'yes' : 'no'}
Target: Production-ready React component, single file, no external dependencies beyond listed libraries.`

  // --- COMPONENT_SPEC ---
  const staggerProp = t.stagger
    ? `\n  - staggerDelay?: number (default: ${t.staggerDelay ?? 0.1})`
    : ''
  const COMPONENT_SPEC = `Component name: ${componentName}
Element: ${t.element}
Props interface:
  - children?: React.ReactNode
  - className?: string
  - duration?: 'fast' | 'medium' | 'slow' | 'dramatic' (default: '${t.duration}')
  - delay?: number (default: 0)${staggerProp}
Initial state: element is invisible/in starting position before animation plays.`

  // --- ANIMATION_TOKENS ---
  const staggerLine = t.stagger
    ? `STAGGER: true (delay: ${t.staggerDelay ?? 0.1}s between each child)`
    : 'STAGGER: false'
  const ANIMATION_TOKENS = `ELEMENT: ${t.element}
TRIGGER: ${t.trigger}
TYPE: ${t.type}
DIRECTION: ${t.direction}
${staggerLine}
EASING: ${t.easing}
DURATION: ${t.duration} (${durationMs[t.duration] ?? 600}ms)
LIBRARY: ${t.library}
STYLE: ${t.style}`

  // --- VISUAL_REFERENCE ---
  const VISUAL_REFERENCE = `${entry.description.en}
After animation completes: the element is fully visible, at rest, at its natural position in the layout.
No residual transforms, filters, or clip-paths remain after the animation ends.`

  // --- CODE_CONSTRAINTS ---
  const libraryConstraints: string[] = []
  if (t.library === 'gsap') {
    libraryConstraints.push(
      '- Register ScrollTrigger plugin at module level: gsap.registerPlugin(ScrollTrigger)',
      '- Clean up in useEffect return: ctx.revert() (use gsap.context)',
    )
  }
  if (t.library === 'r3f') {
    libraryConstraints.push(
      '- Wrap Canvas in <Suspense fallback={<div />}>',
      '- Dispose geometries and materials in useEffect cleanup',
    )
  }
  const CODE_CONSTRAINTS = `- Use CSS custom property var(--ease-out-expo) for easing, not hardcoded cubic-bezier
- Implement prefers-reduced-motion: if reduced motion, skip animation (show element immediately)
- Do NOT use any: avoid TypeScript any type
- Single file component — no separate CSS files
${libraryConstraints.map((c) => c).join('\n')}
- Performance: ${entry.config.performance} cost — ${perfAdvice[entry.config.performance]}`

  // --- OUTPUT_FORMAT ---
  const OUTPUT_FORMAT = `Return a single .tsx file containing:
1. All imports at top
2. TypeScript props interface
3. Default export of the React component
4. Named export: export const FROZEN_PROMPT = '...' (this exact prompt as a string)
5. No placeholder comments — fully implemented
Filename: ${componentName}.tsx`

  // --- VALIDATION_CRITERIA ---
  const triggerDesc = triggerConditions[t.trigger] ?? t.trigger
  const staggerValidation = t.stagger
    ? `\n✓ Each child animates with ${t.staggerDelay ?? 0.1}s offset`
    : ''
  const VALIDATION_CRITERIA = `The implementation is correct if:
✓ Animation plays when ${triggerDesc}
✓ Element starts at: invisible/starting position (opacity 0, translated, scaled, or clipped)
✓ Element ends at: natural position, fully visible, no residual transforms${staggerValidation}
✓ Prefers-reduced-motion: animation is skipped, element shown immediately
✓ TypeScript: zero errors with strict mode
✓ No console errors or warnings`

  const sections = {
    CONTEXT,
    COMPONENT_SPEC,
    ANIMATION_TOKENS,
    VISUAL_REFERENCE,
    CODE_CONSTRAINTS,
    OUTPUT_FORMAT,
    VALIDATION_CRITERIA,
  }

  const fullPrompt = Object.entries(sections)
    .map(([key, value]) => `[${key}]\n${value}`)
    .join('\n\n')

  const frozenHash = await sha256Hex(ANIMATION_TOKENS)

  return {
    sections,
    fullPrompt,
    frozenHash,
    generatedAt: new Date().toISOString(),
    version: '1.0',
    entryId: entry.id,
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validateFrozenPrompt(prompt: FrozenPrompt): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check all 7 sections non-empty
  const sectionKeys = [
    'CONTEXT',
    'COMPONENT_SPEC',
    'ANIMATION_TOKENS',
    'VISUAL_REFERENCE',
    'CODE_CONSTRAINTS',
    'OUTPUT_FORMAT',
    'VALIDATION_CRITERIA',
  ] as const

  for (const key of sectionKeys) {
    if (!prompt.sections[key] || prompt.sections[key].trim().length === 0) {
      errors.push(`Section ${key} is empty`)
    }
  }

  // Version present
  if (!prompt.version || prompt.version.trim().length === 0) {
    errors.push('version is missing')
  }

  // EntryId present
  if (!prompt.entryId || prompt.entryId.trim().length === 0) {
    errors.push('entryId is missing')
  }

  // frozenHash is 12 chars hex
  if (!/^[0-9a-f]{12}$/.test(prompt.frozenHash)) {
    errors.push(
      `frozenHash must be 12 hex characters, got: "${prompt.frozenHash}"`,
    )
  }

  // generatedAt is valid ISO date
  if (!prompt.generatedAt || isNaN(Date.parse(prompt.generatedAt))) {
    errors.push('generatedAt is not a valid ISO date')
  }

  return { valid: errors.length === 0, errors }
}
