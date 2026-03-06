import type { Block } from '@/lib/stores/builder-store'
import type { AnimationEntry } from '@/lib/dictionary'

export type ConflictSeverity = 'warning' | 'error'

export type Conflict = {
  id: string
  severity: ConflictSeverity
  blockIds: string[]
  message: string
  suggestion: string
}

export function detectConflicts(
  blocks: Block[],
  dictionary: AnimationEntry[],
): Conflict[] {
  const conflicts: Conflict[] = []

  // 1. Too many WebGL blocks (>2)
  const webglBlocks = blocks.filter((b) => {
    const entry = dictionary.find((e) => e.id === b.componentId)
    return entry?.config.performance === 'webgl'
  })
  if (webglBlocks.length > 2) {
    conflicts.push({
      id: 'too-many-webgl',
      severity: 'warning',
      blockIds: webglBlocks.map((b) => b.id),
      message: `${webglBlocks.length} komponenty WebGL mogą powodować problemy z wydajnością.`,
      suggestion:
        'Ogranicz liczbę efektów WebGL do maksymalnie 2 na stronę.',
    })
  }

  // 2. Duplicate pin-section components
  const pinBlocks = blocks.filter((b) => b.componentId === 'pin-section')
  if (pinBlocks.length > 1) {
    conflicts.push({
      id: 'duplicate-pin',
      severity: 'error',
      blockIds: pinBlocks.map((b) => b.id),
      message:
        'Dwie sekcje przypięte (pin) mogą powodować konflikty scrollowania.',
      suggestion: 'Użyj maksymalnie jednej sekcji pin na stronie.',
    })
  }

  // 3. Conflicting animations from compatibility data
  blocks.forEach((block) => {
    const entry = dictionary.find((e) => e.id === block.componentId)
    if (!entry) return
    entry.compatibility.conflicts_with.forEach((conflictId) => {
      const conflictingBlock = blocks.find(
        (b) => b.componentId === conflictId,
      )
      if (conflictingBlock) {
        const alreadyAdded = conflicts.some(
          (c) =>
            c.blockIds.includes(block.id) &&
            c.blockIds.includes(conflictingBlock.id),
        )
        if (!alreadyAdded) {
          conflicts.push({
            id: `conflict-${block.id}-${conflictingBlock.id}`,
            severity: 'warning',
            blockIds: [block.id, conflictingBlock.id],
            message: `"${entry.name.en}" i "${dictionary.find((e) => e.id === conflictId)?.name.en}" mogą ze sobą kolidować.`,
            suggestion: 'Rozważ użycie tylko jednego z tych efektów.',
          })
        }
      }
    })
  })

  // 4. Too many blocks total
  if (blocks.length > 12) {
    conflicts.push({
      id: 'too-many-blocks',
      severity: 'warning',
      blockIds: [],
      message: `${blocks.length} bloków może spowolnić stronę.`,
      suggestion: 'Rozważ uproszczenie do maksymalnie 10-12 bloków.',
    })
  }

  // 5. Too many onLoad animations
  const onLoadBlocks = blocks.filter((b) => {
    const entry = dictionary.find((e) => e.id === b.componentId)
    return entry?.tokens.trigger === 'onLoad' && !b.animationConfig.disabled
  })
  if (onLoadBlocks.length > 3) {
    conflicts.push({
      id: 'too-many-onload',
      severity: 'warning',
      blockIds: onLoadBlocks.map((b) => b.id),
      message:
        'Wiele animacji onLoad może sprawić że strona będzie wyglądać chaotycznie.',
      suggestion:
        'Ogranicz animacje onLoad do 2-3 elementów. Resztę zmień na onView.',
    })
  }

  return conflicts
}
