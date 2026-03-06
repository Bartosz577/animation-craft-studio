import { z } from 'zod/v4'
import type { AnimationEntry } from './types'

const AnimationCategorySchema = z.enum([
  'entrance',
  'exit',
  'scroll',
  'hover',
  'loop',
  'gestural',
  '3d',
  'shader',
  'typography',
  'transition',
  'micro-interaction',
])

const PerformanceCostSchema = z.enum(['low', 'medium', 'high', 'webgl'])

const AnimationLibrarySchema = z.enum([
  'motion',
  'gsap',
  'r3f',
  'css',
  'lenis',
])

export const AnimationTokensSchema = z.object({
  element: z.enum([
    'heading',
    'hero',
    'section',
    'card',
    'image',
    'button',
    'nav',
    'text',
    'list',
    'grid',
  ]),
  trigger: z.enum([
    'onLoad',
    'onScroll',
    'onHover',
    'onClick',
    'onView',
    'onLeave',
  ]),
  type: z.enum([
    'fade',
    'slide',
    'scale',
    'rotate',
    'blur',
    'clip',
    'morph',
    '3d',
    'split',
    'scramble',
    'wave',
    'magnetic',
    'particle',
    'glitch',
  ]),
  direction: z.enum([
    'up',
    'down',
    'left',
    'right',
    'center',
    'radial',
    'none',
  ]),
  stagger: z.boolean(),
  staggerDelay: z.number().optional(),
  easing: z.enum([
    'spring',
    'ease-out',
    'ease-in-out',
    'elastic',
    'bounce',
    'linear',
    'expo-out',
  ]),
  duration: z.enum(['fast', 'medium', 'slow', 'dramatic']),
  library: AnimationLibrarySchema,
  style: z.enum([
    'minimal',
    'bold',
    'playful',
    'editorial',
    'luxury',
    'brutal',
    'organic',
  ]),
})

const LibraryRequirementSchema = z.object({
  name: AnimationLibrarySchema,
  version: z.string(),
  required: z.boolean(),
})

export const AnimationEntrySchema = z.object({
  id: z.string(),
  name: z.object({ pl: z.string(), en: z.string() }),
  category: AnimationCategorySchema,
  subcategory: z.string(),
  tags: z.array(z.string()),
  description: z.object({
    pl: z.string(),
    en: z.string(),
    technical: z.string(),
  }),
  preview: z.object({
    component: z.string(),
    thumbnail: z.string(),
    gif: z.string().optional(),
  }),
  code: z.object({
    minimal: z.string(),
    full: z.string(),
    storybook_story: z.string(),
  }),
  prompt: z.object({
    fragment: z.string(),
    full_prompt: z.string(),
    frozen_hash: z.string(),
  }),
  tokens: AnimationTokensSchema,
  libraries: z.array(LibraryRequirementSchema),
  config: z.object({
    intensity: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
    performance: PerformanceCostSchema,
  }),
  compatibility: z.object({
    pairs_well_with: z.array(z.string()),
    conflicts_with: z.array(z.string()),
  }),
  examples: z.array(
    z.object({
      site: z.string(),
      url: z.string(),
      screenshot: z.string(),
    })
  ),
})

export function validateEntry(data: unknown): AnimationEntry {
  const result = AnimationEntrySchema.safeParse(data)
  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`AnimationEntry validation failed:\n${messages}`)
  }
  return result.data as unknown as AnimationEntry
}
