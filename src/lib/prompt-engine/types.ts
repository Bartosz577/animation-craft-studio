import type { AnimationTokens } from '@/lib/dictionary'

export type ParsedIntent = {
  raw: string
  language: 'pl' | 'en' | 'mixed'
  tokens: Partial<AnimationTokens>
  confidence: Partial<Record<keyof AnimationTokens, number>>
  ambiguous: (keyof AnimationTokens)[]
  suggestions: string[]
}

export type KeywordMap<T extends string> = {
  keywords: string[]
  value: T
  weight: number
}
