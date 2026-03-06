import { describe, it, expect } from 'vitest'
import { parseIntent } from '@/lib/prompt-engine/parser'
import { findMatches } from '@/lib/prompt-engine/slot-mapper'
import {
  buildFrozenPrompt,
  validateFrozenPrompt,
} from '@/lib/prompt-engine/prompt-builder'
import type { FrozenPrompt } from '@/lib/prompt-engine/prompt-builder'
import { allAnimations } from '@/data/animations'

describe('findMatches', () => {
  it('returns matches for "nagłówek wjeżdża od dołu" with score > 0.3', () => {
    const intent = parseIntent('nagłówek wjeżdża od dołu')
    const matches = findMatches(intent, allAnimations)

    expect(matches.length).toBeGreaterThan(0)
    expect(matches[0].score).toBeGreaterThan(0.3)

    // Should match slide-up-fade or text-split-reveal-up (both have direction:up + slide/split type)
    const topIds = matches.map((m) => m.entry.id)
    const hasRelevant = topIds.some(
      (id) =>
        id === 'text-split-reveal-up' ||
        id === 'slide-up-fade' ||
        id === 'hero-sequence',
    )
    expect(hasRelevant).toBe(true)
  })

  it('returns at most 3 matches', () => {
    const intent = parseIntent('fade in')
    const matches = findMatches(intent, allAnimations)
    expect(matches.length).toBeLessThanOrEqual(3)
  })

  it('filters out entries below 0.2 threshold', () => {
    const intent = parseIntent('fade in')
    const matches = findMatches(intent, allAnimations)
    for (const m of matches) {
      expect(m.score).toBeGreaterThanOrEqual(0.2)
    }
  })
})

describe('buildFrozenPrompt', () => {
  it('generates all 7 non-empty sections for text-split-reveal-up', async () => {
    const intent = parseIntent('nagłówek wjeżdża od dołu litera po literze')
    const matches = findMatches(intent, allAnimations)
    const match = matches.find((m) => m.entry.id === 'text-split-reveal-up') ?? matches[0]

    const prompt = await buildFrozenPrompt(match, {
      framework: 'nextjs',
      frameworkVersion: '16.1',
      typescript: true,
      tailwindVersion: '4',
      preferredLibrary: 'motion',
    })

    // All 7 sections present and non-empty
    expect(prompt.sections.CONTEXT.length).toBeGreaterThan(0)
    expect(prompt.sections.COMPONENT_SPEC.length).toBeGreaterThan(0)
    expect(prompt.sections.ANIMATION_TOKENS.length).toBeGreaterThan(0)
    expect(prompt.sections.VISUAL_REFERENCE.length).toBeGreaterThan(0)
    expect(prompt.sections.CODE_CONSTRAINTS.length).toBeGreaterThan(0)
    expect(prompt.sections.OUTPUT_FORMAT.length).toBeGreaterThan(0)
    expect(prompt.sections.VALIDATION_CRITERIA.length).toBeGreaterThan(0)

    // ANIMATION_TOKENS contains all 9 token keys
    const tokensSection = prompt.sections.ANIMATION_TOKENS
    expect(tokensSection).toContain('ELEMENT:')
    expect(tokensSection).toContain('TRIGGER:')
    expect(tokensSection).toContain('TYPE:')
    expect(tokensSection).toContain('DIRECTION:')
    expect(tokensSection).toContain('STAGGER:')
    expect(tokensSection).toContain('EASING:')
    expect(tokensSection).toContain('DURATION:')
    expect(tokensSection).toContain('LIBRARY:')
    expect(tokensSection).toContain('STYLE:')

    // Validate passes
    const validation = validateFrozenPrompt(prompt)
    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  it('includes fullPrompt as concatenation of all sections', async () => {
    const intent = parseIntent('przycisk magnetyczny')
    const matches = findMatches(intent, allAnimations)
    const prompt = await buildFrozenPrompt(matches[0], {
      framework: 'react',
      frameworkVersion: '19',
      typescript: true,
      tailwindVersion: '4',
      preferredLibrary: 'motion',
    })

    expect(prompt.fullPrompt).toContain('[CONTEXT]')
    expect(prompt.fullPrompt).toContain('[VALIDATION_CRITERIA]')
    expect(prompt.version).toBe('1.0')
    expect(prompt.entryId).toBeTruthy()
  })
})

describe('validateFrozenPrompt', () => {
  it('returns valid:false and errors for a prompt with missing section', () => {
    const bad: FrozenPrompt = {
      sections: {
        CONTEXT: 'something',
        COMPONENT_SPEC: '',
        ANIMATION_TOKENS: 'tokens',
        VISUAL_REFERENCE: 'ref',
        CODE_CONSTRAINTS: 'constraints',
        OUTPUT_FORMAT: 'format',
        VALIDATION_CRITERIA: 'criteria',
      },
      fullPrompt: 'full',
      frozenHash: 'abc123def456',
      generatedAt: new Date().toISOString(),
      version: '1.0',
      entryId: 'test-entry',
    }

    const result = validateFrozenPrompt(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toContain('COMPONENT_SPEC')
  })

  it('returns valid:false for bad frozenHash', () => {
    const bad: FrozenPrompt = {
      sections: {
        CONTEXT: 'a',
        COMPONENT_SPEC: 'b',
        ANIMATION_TOKENS: 'c',
        VISUAL_REFERENCE: 'd',
        CODE_CONSTRAINTS: 'e',
        OUTPUT_FORMAT: 'f',
        VALIDATION_CRITERIA: 'g',
      },
      fullPrompt: 'full',
      frozenHash: 'too-short',
      generatedAt: new Date().toISOString(),
      version: '1.0',
      entryId: 'test-entry',
    }

    const result = validateFrozenPrompt(bad)
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) => e.includes('frozenHash'))).toBe(true)
  })
})
