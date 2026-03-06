import type { AnimationCategory } from './types'

export const categoryColors: Record<AnimationCategory, string> = {
  entrance: '#60a5fa',
  exit: '#f87171',
  scroll: '#34d399',
  hover: '#a78bfa',
  typography: '#fbbf24',
  loop: '#22d3ee',
  transition: '#fb923c',
  'micro-interaction': '#f472b6',
  gestural: '#a3e635',
  '3d': '#818cf8',
  shader: '#e879f9',
}

export function getCategoryColor(category: AnimationCategory): string {
  return categoryColors[category]
}
