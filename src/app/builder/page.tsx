'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'motion/react'
import { useBuilderStore, type AnimationTheme } from '@/lib/stores/builder-store'
import { detectConflicts } from '@/lib/builder/conflict-detector'
import { DEFAULT_PROPS } from '@/lib/builder/component-defaults'
import { allAnimations, getAnimationById } from '@/data/animations'
import { getCategoryColor } from '@/lib/dictionary/category-colors'
import ComponentPreview from '@/components/ui/ComponentPreview'
import PropsEditor from '@/components/ui/PropsEditor'
import { showToast } from '@/components/ui/Toast'
import { exportToNextJS } from '@/lib/builder/exporters/code-exporter'
import { exportMasterPrompt } from '@/lib/builder/exporters/prompt-exporter'
import { exportToFigma } from '@/lib/builder/exporters/figma-exporter'

import type { Block } from '@/lib/stores/builder-store'

/* ------------------------------------------------------------------ */
/*  SortableBlockCard                                                  */
/* ------------------------------------------------------------------ */

function SortableBlockCard({
  block,
  isSelected,
  onSelect,
  onDuplicate,
  onRemove,
}: {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id })
  const entry = getAnimationById(block.componentId)
  const catColor = entry ? getCategoryColor(entry.category) : '#888'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '12px',
        background: 'var(--color-surface-elevated)',
        border: isSelected
          ? '2px solid var(--color-accent)'
          : '1px solid var(--color-border)',
        cursor: 'pointer',
        opacity: block.animationConfig.disabled ? 0.5 : 1,
        position: 'relative',
      }}
      onClick={onSelect}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: block.animationConfig.disabled ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          userSelect: 'none',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ⠿
      </span>

      {/* Center: name + badge + preview */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-display)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {entry?.name.en ?? block.componentId}
          </span>
          {entry && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                background: catColor + '22',
                color: catColor,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              {entry.category}
            </span>
          )}
        </div>
        <div
          style={{
            height: '80px',
            overflow: 'hidden',
            borderRadius: '6px',
            pointerEvents: 'none',
          }}
        >
          <ComponentPreview
            mode="card"
            componentId={block.componentId}
            propValues={block.props}
          />
        </div>
      </div>

      {/* Right: action buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          title="Edytuj"
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate()
          }}
          title="Duplikuj"
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          title="Usuń"
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  BuilderPage                                                        */
/* ------------------------------------------------------------------ */

export default function BuilderPage() {
  const {
    blocks,
    selectedBlockId,
    globalTheme,
    previewMode,
    addBlock,
    removeBlock,
    reorderBlocks,
    updateBlockProps,
    updateBlockAnimation,
    duplicateBlock,
    setSelectedBlockId,
    setGlobalTheme,
    setPreviewMode,
  } = useBuilderStore()

  const [pickerSearch, setPickerSearch] = useState('')
  const [showConflicts, setShowConflicts] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExportingPrompt, setIsExportingPrompt] = useState(false)

  const conflicts = useMemo(
    () => detectConflicts(blocks, allAnimations),
    [blocks],
  )

  const filteredAnimations = useMemo(() => {
    if (!pickerSearch.trim()) return allAnimations
    const q = pickerSearch.toLowerCase()
    return allAnimations.filter(
      (entry) =>
        entry.name.en.toLowerCase().includes(q) ||
        entry.name.pl.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [pickerSearch])

  const selectedBlock =
    blocks.find((b) => b.id === selectedBlockId) ?? null

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      const activeIdStr = active.id as string

      if (activeIdStr.startsWith('picker-')) {
        const componentId = activeIdStr.replace('picker-', '')
        addBlock(componentId, DEFAULT_PROPS[componentId] ?? {})
      } else if (over) {
        reorderBlocks(activeIdStr, over.id as string)
      }

      setDragActiveId(null)
    },
    [addBlock, reorderBlocks],
  )

  /* ---------------------------------------------------------------- */
  /*  PREVIEW MODE OVERLAY                                             */
  /* ---------------------------------------------------------------- */

  if (previewMode) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'var(--color-background)',
          overflowY: 'auto',
        }}
      >
        {blocks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((block) => (
            <div
              key={block.id}
              style={{ padding: '48px 32px' }}
            >
              {block.animationConfig.disabled ? (
                <div
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    opacity: 0.4,
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  [{getAnimationById(block.componentId)?.name.en ?? block.componentId} - disabled]
                </div>
              ) : (
                <ComponentPreview
                  mode="full"
                  componentId={block.componentId}
                  propValues={block.props}
                />
              )}
            </div>
          ))}

        {/* Bottom bar */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '56px',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '24px',
            paddingRight: '24px',
            zIndex: 51,
          }}
        >
          <button
            onClick={() => setPreviewMode(false)}
            style={{
              background: 'var(--color-accent)',
              color: '#050505',
              borderRadius: '8px',
              padding: '8px 16px',
              border: 'none',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            ← Wyjdź z podglądu
          </button>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  MAIN LAYOUT                                                      */
  /* ---------------------------------------------------------------- */

  const dragActiveEntry = dragActiveId
    ? getAnimationById(
        dragActiveId.startsWith('picker-')
          ? dragActiveId.replace('picker-', '')
          : blocks.find((b) => b.id === dragActiveId)?.componentId ?? '',
      )
    : null

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--color-background)',
          color: 'var(--color-text-primary)',
        }}
      >
        {/* ============================================================ */}
        {/*  LEFT PANEL                                                   */}
        {/* ============================================================ */}
        <div
          style={{
            width: '260px',
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '16px 16px 8px',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Komponenty
          </h2>

          <input
            type="text"
            placeholder="Szukaj komponentów..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            style={{
              margin: '0 16px 12px',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          />

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 8px',
            }}
          >
            {filteredAnimations.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'var(--color-surface-elevated)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ color: getCategoryColor(entry.category) }}>
                  ●
                </span>
                <span
                  style={{
                    flex: 1,
                    color: 'var(--color-text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name.en}
                </span>
                <button
                  onClick={() =>
                    addBlock(entry.id, DEFAULT_PROPS[entry.id] ?? {})
                  }
                  style={{
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      'var(--color-text-secondary)'
                  }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  CENTER PANEL                                                 */}
        {/* ============================================================ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              borderBottom: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              gap: '16px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text-primary)',
              }}
            >
              Block Builder
            </span>

            {/* Center: conflicts */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {conflicts.length > 0 && (
                <button
                  onClick={() => setShowConflicts(!showConflicts)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: conflicts.some((c) => c.severity === 'error')
                      ? '#dc262630'
                      : '#eab30830',
                    color: conflicts.some((c) => c.severity === 'error')
                      ? '#f87171'
                      : '#fbbf24',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'currentColor',
                    }}
                  />
                  {conflicts.length} ostrzeżeń
                </button>
              )}
            </div>

            {/* Right: preview + export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setPreviewMode(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-elevated)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Podgląd
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-elevated)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Export ▾
                </button>

                {showExportMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      minWidth: '200px',
                      background: 'var(--color-surface-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '4px',
                      zIndex: 20,
                    }}
                  >
                    {[
                      {
                        label: 'Eksportuj kod',
                        onClick: () => {
                          const code = exportToNextJS(blocks, globalTheme)
                          const blob = new Blob([code], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'page.tsx'
                          a.click()
                          URL.revokeObjectURL(url)
                          showToast('page.tsx pobrany ✓')
                        },
                      },
                      {
                        label: isExportingPrompt ? 'Generowanie...' : 'Eksportuj prompt',
                        onClick: async () => {
                          setIsExportingPrompt(true)
                          try {
                            const prompt = await exportMasterPrompt(blocks, globalTheme)
                            await navigator.clipboard.writeText(prompt.fullPrompt)
                            showToast('Master prompt skopiowany ✓')
                          } finally {
                            setIsExportingPrompt(false)
                          }
                        },
                      },
                      {
                        label: 'Eksportuj Figma',
                        onClick: () => {
                          const figma = exportToFigma(blocks)
                          const blob = new Blob(
                            [JSON.stringify(figma, null, 2)],
                            { type: 'application/json' },
                          )
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'animation-craft-studio-layout.json'
                          a.click()
                          URL.revokeObjectURL(url)
                          showToast('Figma JSON pobrany ✓')
                        },
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.onClick()
                          setShowExportMenu(false)
                        }}
                        disabled={isExportingPrompt && item.label.includes('prompt')}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 12px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-text-primary)',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontSize: '12px',
                          opacity: isExportingPrompt && item.label.includes('Generowanie') ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'var(--color-surface)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conflicts panel */}
          <AnimatePresence>
            {showConflicts && conflicts.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  background: 'var(--color-surface-elevated)',
                  borderBottom: '1px solid var(--color-border)',
                  padding: '16px 24px',
                  overflow: 'hidden',
                }}
              >
                {conflicts.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      {c.severity === 'error' ? '✕' : '⚠'}
                    </span>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color:
                            c.severity === 'error' ? '#f87171' : '#fbbf24',
                          fontWeight: 500,
                        }}
                      >
                        {c.message}
                      </p>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {c.suggestion}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowConflicts(false)}
                  style={{
                    marginTop: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  Zamknij
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas body */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
            }}
          >
            {blocks.length === 0 ? (
              <div
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: '12px',
                  padding: '64px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  Przeciągnij komponenty tutaj
                </p>
                <button
                  onClick={() =>
                    addBlock(
                      'text-split-reveal-up',
                      DEFAULT_PROPS['text-split-reveal-up'] ?? {},
                    )
                  }
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--color-accent)',
                    color: '#050505',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Dodaj pierwszy komponent
                </button>
              </div>
            ) : (
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {blocks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <SortableBlockCard
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        onSelect={() => setSelectedBlockId(block.id)}
                        onDuplicate={() => duplicateBlock(block.id)}
                        onRemove={() => removeBlock(block.id)}
                      />
                    ))}
                </div>
              </SortableContext>
            )}
          </div>

          {/* DragOverlay */}
          <DragOverlay>
            {dragActiveId && dragActiveEntry ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'var(--color-surface-elevated)',
                  border: '2px solid var(--color-accent)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-display)',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    color: getCategoryColor(dragActiveEntry.category),
                  }}
                >
                  ●
                </span>
                {dragActiveEntry.name.en}
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background:
                      getCategoryColor(dragActiveEntry.category) + '22',
                    color: getCategoryColor(dragActiveEntry.category),
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {dragActiveEntry.category}
                </span>
              </div>
            ) : null}
          </DragOverlay>

          {/* ---------------------------------------------------------- */}
          {/*  TIMELINE                                                    */}
          {/* ---------------------------------------------------------- */}
          <div
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              gap: '8px',
              flexShrink: 0,
            }}
            onClick={() => setShowTimeline(!showTimeline)}
          >
            <span>⏱</span>
            <span>Oś czasu animacji</span>
            <span style={{ marginLeft: 'auto' }}>
              {showTimeline ? '▼' : '▲'}
            </span>
          </div>

          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 160, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  overflow: 'hidden',
                  background: 'var(--color-background)',
                  borderTop: '1px solid var(--color-border)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    overflowY: 'auto',
                    padding: '8px 0',
                  }}
                >
                  {blocks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((block) => {
                      const entry = getAnimationById(block.componentId)
                      const catColor = entry
                        ? getCategoryColor(entry.category)
                        : '#888'
                      return (
                        <div
                          key={block.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '28px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedBlockId(block.id)}
                        >
                          <div
                            style={{
                              width: '120px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '11px',
                              padding: '0 16px',
                              color: 'var(--color-text-secondary)',
                              flexShrink: 0,
                            }}
                          >
                            {entry?.name.en ?? block.componentId}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              position: 'relative',
                              height: '24px',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: `${(block.animationConfig.delay / 3000) * 100}%`,
                                width: '120px',
                                height: '100%',
                                borderRadius: '4px',
                                background: catColor + '99',
                              }}
                            />
                          </div>
                        </div>
                      )
                    })}

                  {/* X-axis labels */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 16px 4px 136px',
                      fontSize: '9px',
                      color: 'var(--color-text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span>0s</span>
                    <span>0.75s</span>
                    <span>1.5s</span>
                    <span>2.25s</span>
                    <span>3s</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/*  RIGHT PANEL                                                  */}
        {/* ============================================================ */}
        <div
          style={{
            width: '320px',
            borderLeft: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          {!selectedBlock ? (
            /* -------------------------------------------------------- */
            /*  Global Settings                                          */
            /* -------------------------------------------------------- */
            <div style={{ padding: '24px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '14px',
                  marginBottom: '16px',
                  marginTop: 0,
                  color: 'var(--color-text-primary)',
                }}
              >
                Globalny motyw
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {(
                  [
                    {
                      key: 'minimal' as AnimationTheme,
                      name: 'Minimal',
                      desc: 'Subtelny, szybki, elegancki',
                    },
                    {
                      key: 'bold' as AnimationTheme,
                      name: 'Bold',
                      desc: 'Wyrazisty, sprężynowy, energiczny',
                    },
                    {
                      key: 'editorial' as AnimationTheme,
                      name: 'Editorial',
                      desc: 'Magazynowy, powolny reveal',
                    },
                    {
                      key: 'luxury' as AnimationTheme,
                      name: 'Luxury',
                      desc: 'Premium, dramatyczny',
                    },
                  ] as const
                ).map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => setGlobalTheme(theme.key)}
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      border:
                        globalTheme === theme.key
                          ? '2px solid var(--color-accent)'
                          : '1px solid var(--color-border)',
                      background:
                        globalTheme === theme.key
                          ? 'rgba(160, 255, 96, 0.1)'
                          : 'var(--color-background)',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {theme.name}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px',
                      }}
                    >
                      {theme.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  background: 'var(--color-border)',
                  margin: '24px 0',
                }}
              />

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span>{blocks.length} bloków</span>
                <span>
                  {
                    blocks.filter((b) => !b.animationConfig.disabled)
                      .length
                  }{' '}
                  aktywnych animacji
                </span>
                {conflicts.length > 0 && (
                  <span style={{ color: '#fbbf24' }}>
                    {conflicts.length} ostrzeżeń
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* -------------------------------------------------------- */
            /*  Selected Block Editor                                    */
            /* -------------------------------------------------------- */
            <>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {getAnimationById(selectedBlock.componentId)?.name.en ??
                    selectedBlock.componentId}
                </span>
                <button
                  onClick={() => setSelectedBlockId(null)}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable content */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {/* Description */}
                {(() => {
                  const entry = getAnimationById(selectedBlock.componentId)
                  return entry ? (
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {entry.description.pl}
                    </p>
                  ) : null
                })()}

                {/* Props editor */}
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Właściwości
                  </span>
                  <PropsEditor
                    componentId={selectedBlock.componentId}
                    propValues={selectedBlock.props}
                    onChange={(key, val) =>
                      updateBlockProps(selectedBlock.id, { [key]: val })
                    }
                  />
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'var(--color-border)',
                  }}
                />

                {/* Animation settings */}
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-text-secondary)',
                      marginBottom: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Ustawienia animacji
                  </span>

                  {/* Delay */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Opóźnienie
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <input
                        type="range"
                        min={0}
                        max={3000}
                        step={100}
                        value={selectedBlock.animationConfig.delay}
                        onChange={(e) =>
                          updateBlockAnimation(selectedBlock.id, {
                            delay: Number(e.target.value),
                          })
                        }
                        style={{
                          flex: 1,
                          accentColor: 'var(--color-accent)',
                          height: '4px',
                          cursor: 'pointer',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--color-text-primary)',
                          minWidth: '50px',
                          textAlign: 'right',
                        }}
                      >
                        {selectedBlock.animationConfig.delay}ms
                      </span>
                    </div>
                  </div>

                  {/* Duration pills */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Czas trwania
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {(
                        ['default', 'fast', 'medium', 'slow', 'dramatic'] as const
                      ).map((pill) => {
                        const selected =
                          (selectedBlock.animationConfig.durationOverride ??
                            'default') === pill
                        return (
                          <button
                            key={pill}
                            onClick={() =>
                              updateBlockAnimation(selectedBlock.id, {
                                durationOverride:
                                  pill === 'default' ? undefined : pill,
                              })
                            }
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: selected
                                ? 'var(--color-accent)'
                                : 'var(--color-surface-elevated)',
                              color: selected
                                ? '#050505'
                                : 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: selected ? 700 : 400,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {pill}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Trigger pills */}
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Wyzwalacz
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {(
                        [
                          'default',
                          'onLoad',
                          'onScroll',
                          'onView',
                          'onHover',
                        ] as const
                      ).map((pill) => {
                        const selected =
                          (selectedBlock.animationConfig.triggerOverride ??
                            'default') === pill
                        return (
                          <button
                            key={pill}
                            onClick={() =>
                              updateBlockAnimation(selectedBlock.id, {
                                triggerOverride:
                                  pill === 'default' ? undefined : pill,
                              })
                            }
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              background: selected
                                ? 'var(--color-accent)'
                                : 'var(--color-surface-elevated)',
                              color: selected
                                ? '#050505'
                                : 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: selected ? 700 : 400,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {pill}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Disable toggle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Wyłącz animację
                    </label>
                    <div
                      role="switch"
                      aria-checked={selectedBlock.animationConfig.disabled}
                      tabIndex={0}
                      onClick={() =>
                        updateBlockAnimation(selectedBlock.id, {
                          disabled:
                            !selectedBlock.animationConfig.disabled,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          updateBlockAnimation(selectedBlock.id, {
                            disabled:
                              !selectedBlock.animationConfig.disabled,
                          })
                        }
                      }}
                      style={{
                        position: 'relative',
                        width: '40px',
                        height: '20px',
                        borderRadius: '10px',
                        background: selectedBlock.animationConfig.disabled
                          ? 'var(--color-accent)'
                          : 'var(--color-border)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: selectedBlock.animationConfig.disabled
                            ? '22px'
                            : '2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: selectedBlock.animationConfig.disabled
                            ? '#050505'
                            : 'var(--color-text-secondary)',
                          transition: 'left 0.2s ease, background 0.2s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: 'var(--color-border)',
                  }}
                />

                {/* Delete block */}
                <button
                  onClick={() => {
                    removeBlock(selectedBlock.id)
                    setSelectedBlockId(null)
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(220, 38, 38, 0.2)',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(220, 38, 38, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(220, 38, 38, 0.2)'
                  }}
                >
                  Usuń blok
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DndContext>
  )
}
