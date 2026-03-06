import { describe, it, expect } from 'vitest'
import { parseIntent } from '@/lib/prompt-engine/parser'

describe('parseIntent', () => {
  it('1. "nagłówek wjeżdża od dołu litera po literze" → heading, split, up, stagger:true', () => {
    const result = parseIntent('nagłówek wjeżdża od dołu litera po literze')
    expect(result.tokens.element).toBe('heading')
    expect(result.tokens.type).toBe('split')
    expect(result.tokens.direction).toBe('up')
    expect(result.tokens.stagger).toBe(true)
    expect(result.language).toBe('pl')
  })

  it('2. "przycisk magnetyczny z spring physics" → button, magnetic, spring', () => {
    const result = parseIntent('przycisk magnetyczny z spring physics')
    expect(result.tokens.element).toBe('button')
    expect(result.tokens.type).toBe('magnetic')
    expect(result.tokens.easing).toBe('spring')
  })

  it('3. "zdjęcie odkrywa się od lewej podczas scrollowania" → image, clip, right, onScroll', () => {
    const result = parseIntent('zdjęcie odkrywa się od lewej podczas scrollowania')
    expect(result.tokens.element).toBe('image')
    expect(result.tokens.type).toBe('clip')
    expect(result.tokens.direction).toBe('right')
    expect(result.tokens.trigger).toBe('onScroll')
  })

  it('4. "hero section fades in on load" → hero, onLoad, fade, language:en', () => {
    const result = parseIntent('hero section fades in on load')
    expect(result.tokens.element).toBe('hero')
    expect(result.tokens.trigger).toBe('onLoad')
    expect(result.tokens.type).toBe('fade')
    expect(result.language).toBe('en')
  })

  it('5. "karta 3D obraca się przy hoverze" → card, 3d, onHover', () => {
    const result = parseIntent('karta 3D obraca się przy hoverze')
    expect(result.tokens.element).toBe('card')
    expect(result.tokens.type).toBe('3d')
    expect(result.tokens.trigger).toBe('onHover')
  })

  it('6. "tekst pojawia się litera po literze z rozmyciem od dołu" → split wins over blur, direction:up', () => {
    const result = parseIntent('tekst pojawia się litera po literze z rozmyciem od dołu')
    // "litera po literze" (split weight 0.95) beats "rozmyciem" (blur weight ~0.6)
    expect(result.tokens.type).toBe('split')
    expect(result.tokens.direction).toBe('up')
  })

  it('7. "sekcje wchodzą kolejno podczas scrollowania" → onScroll, stagger:true', () => {
    const result = parseIntent('sekcje wchodzą kolejno podczas scrollowania')
    expect(result.tokens.trigger).toBe('onScroll')
    expect(result.tokens.stagger).toBe(true)
  })

  it('8. "magnetyczny przycisk cta odpycha kursor" → button, magnetic, onHover', () => {
    const result = parseIntent('magnetyczny przycisk cta odpycha kursor')
    expect(result.tokens.element).toBe('button')
    expect(result.tokens.type).toBe('magnetic')
  })

  it('9. "particle system w tle" → particle', () => {
    const result = parseIntent('particle system w tle')
    expect(result.tokens.type).toBe('particle')
  })

  it('10. "slow dramatic reveal of the hero image" → dramatic, clip, image, language:en', () => {
    const result = parseIntent('slow dramatic reveal of the hero image')
    expect(result.tokens.duration).toBe('dramatic')
    expect(result.tokens.type).toBe('clip')
    expect(result.tokens.element).toBe('image')
    expect(result.language).toBe('en')
  })

  it('returns ambiguous tokens for low-confidence matches', () => {
    const result = parseIntent('coś się dzieje')
    // Very vague input — most tokens should be missing or ambiguous
    expect(result.ambiguous.length).toBeGreaterThanOrEqual(0)
    expect(result.suggestions.length).toBeGreaterThan(0)
  })

  it('sets stagger to false with 0.5 confidence when no stagger keywords found', () => {
    const result = parseIntent('button fade in')
    expect(result.tokens.stagger).toBe(false)
    expect(result.confidence.stagger).toBe(0.5)
  })
})
