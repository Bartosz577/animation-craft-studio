export type AnimationCategory =
  | 'entrance'
  | 'exit'
  | 'scroll'
  | 'hover'
  | 'loop'
  | 'gestural'
  | '3d'
  | 'shader'
  | 'typography'
  | 'transition'
  | 'micro-interaction'

export type PerformanceCost = 'low' | 'medium' | 'high' | 'webgl'

export type AnimationLibrary = 'motion' | 'gsap' | 'r3f' | 'css' | 'lenis'

export type AnimationTokens = {
  element:
    | 'heading'
    | 'hero'
    | 'section'
    | 'card'
    | 'image'
    | 'button'
    | 'nav'
    | 'text'
    | 'list'
    | 'grid'
  trigger:
    | 'onLoad'
    | 'onScroll'
    | 'onHover'
    | 'onClick'
    | 'onView'
    | 'onLeave'
  type:
    | 'fade'
    | 'slide'
    | 'scale'
    | 'rotate'
    | 'blur'
    | 'clip'
    | 'morph'
    | '3d'
    | 'split'
    | 'scramble'
    | 'wave'
    | 'magnetic'
    | 'particle'
    | 'glitch'
  direction:
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'center'
    | 'radial'
    | 'none'
  stagger: boolean
  staggerDelay?: number
  easing:
    | 'spring'
    | 'ease-out'
    | 'ease-in-out'
    | 'elastic'
    | 'bounce'
    | 'linear'
    | 'expo-out'
  duration: 'fast' | 'medium' | 'slow' | 'dramatic'
  library: AnimationLibrary
  style:
    | 'minimal'
    | 'bold'
    | 'playful'
    | 'editorial'
    | 'luxury'
    | 'brutal'
    | 'organic'
}

export type LibraryRequirement = {
  name: AnimationLibrary
  version: string
  required: boolean
}

export interface AnimationEntry {
  id: string
  name: { pl: string; en: string }
  category: AnimationCategory
  subcategory: string
  tags: string[]
  description: { pl: string; en: string; technical: string }
  preview: { component: string; thumbnail: string; gif?: string }
  code: { minimal: string; full: string; storybook_story: string }
  prompt: { fragment: string; full_prompt: string; frozen_hash: string }
  tokens: AnimationTokens
  libraries: LibraryRequirement[]
  config: { intensity: 1 | 2 | 3 | 4 | 5; performance: PerformanceCost }
  compatibility: { pairs_well_with: string[]; conflicts_with: string[] }
  examples: { site: string; url: string; screenshot: string }[]
}
