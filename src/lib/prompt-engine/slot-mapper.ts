import type { AnimationEntry, AnimationTokens } from '@/lib/dictionary'
import type { ParsedIntent } from './types'

export type Match = {
  entry: AnimationEntry
  score: number
  matchedTokens: (keyof AnimationTokens)[]
  missingTokens: (keyof AnimationTokens)[]
}

const SCORE_THRESHOLD = 0.2
const MAX_RESULTS = 3
const STAGGER_BONUS = 0.1

export function findMatches(
  intent: ParsedIntent,
  dictionary: AnimationEntry[],
): Match[] {
  // Determine which tokens were actually detected in the intent
  const detectedKeys = (
    Object.keys(intent.tokens) as (keyof AnimationTokens)[]
  ).filter((key) => intent.tokens[key] !== undefined)

  if (detectedKeys.length === 0) return []

  const matches: Match[] = []

  for (const entry of dictionary) {
    const matchedTokens: (keyof AnimationTokens)[] = []
    const missingTokens: (keyof AnimationTokens)[] = []

    for (const key of detectedKeys) {
      // Skip staggerDelay — it's a numeric sub-token, not a primary match criterion
      if (key === 'staggerDelay') continue

      const intentValue = intent.tokens[key]
      const entryValue = entry.tokens[key]

      if (intentValue === entryValue) {
        matchedTokens.push(key)
      } else {
        missingTokens.push(key)
      }
    }

    // Count only primary tokens (exclude staggerDelay) for scoring denominator
    const primaryKeys = detectedKeys.filter((k) => k !== 'staggerDelay')
    if (primaryKeys.length === 0) continue

    let score = matchedTokens.length / primaryKeys.length

    // Stagger bonus: if user wants stagger and entry has stagger
    if (intent.tokens.stagger === true && entry.tokens.stagger === true) {
      score = Math.min(1, score + STAGGER_BONUS)
    }

    if (score >= SCORE_THRESHOLD) {
      matches.push({ entry, score, matchedTokens, missingTokens })
    }
  }

  matches.sort((a, b) => b.score - a.score)

  return matches.slice(0, MAX_RESULTS)
}
