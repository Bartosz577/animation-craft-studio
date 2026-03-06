import type { Block } from '@/lib/stores/builder-store'
import { COMPONENT_NAME_MAP } from './prompt-exporter'

export type FigmaFrame = {
  name: string
  width: number
  height: number
  backgroundColor: string
  children: FigmaLayer[]
}

export type FigmaLayer = {
  name: string
  type: 'FRAME' | 'TEXT' | 'RECTANGLE'
  x: number
  y: number
  width: number
  height: number
  fills?: {
    type: 'SOLID'
    color: { r: number; g: number; b: number; a: number }
  }[]
  characters?: string
}

export function exportToFigma(
  blocks: Block[],
): { document: FigmaFrame } {
  const pageHeight = Math.max(blocks.length * 600, 900)

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  const children: FigmaLayer[] = sortedBlocks.flatMap((block, i) => {
    const name = COMPONENT_NAME_MAP[block.componentId] ?? block.componentId
    return [
      {
        name: `Section ${i + 1} - ${name}`,
        type: 'FRAME' as const,
        x: 0,
        y: i * 600,
        width: 1440,
        height: 580,
        fills: [
          {
            type: 'SOLID' as const,
            color: { r: 0.06, g: 0.06, b: 0.06, a: 1 },
          },
        ],
      },
      {
        name: `Label: ${name}`,
        type: 'TEXT' as const,
        x: 40,
        y: i * 600 + 20,
        width: 400,
        height: 40,
        characters: `${i + 1}. ${name}`,
      },
    ]
  })

  return {
    document: {
      name: 'Animation Craft Studio — Generated Layout',
      width: 1440,
      height: pageHeight,
      backgroundColor: '#050505',
      children,
    },
  }
}
