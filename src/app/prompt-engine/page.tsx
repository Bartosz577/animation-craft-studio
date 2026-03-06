'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePromptEngineStore } from '@/lib/stores/prompt-engine-store'
import { parseIntent } from '@/lib/prompt-engine/parser'
import { findMatches } from '@/lib/prompt-engine/slot-mapper'
import { buildFrozenPrompt } from '@/lib/prompt-engine/prompt-builder'
import type { AnimationTokens, AnimationLibrary } from '@/lib/dictionary'
import { allAnimations } from '@/data/animations'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOKEN_VALUE_OPTIONS: Partial<Record<keyof AnimationTokens, string[]>> = {
  element: ['heading', 'hero', 'section', 'card', 'image', 'button', 'nav', 'text', 'list', 'grid'],
  trigger: ['onLoad', 'onScroll', 'onHover', 'onClick', 'onView', 'onLeave'],
  type: ['fade', 'slide', 'scale', 'rotate', 'blur', 'clip', 'morph', '3d', 'split', 'scramble', 'wave', 'magnetic', 'particle', 'glitch'],
  direction: ['up', 'down', 'left', 'right', 'center', 'radial', 'none'],
  easing: ['spring', 'ease-out', 'ease-in-out', 'elastic', 'bounce', 'linear', 'expo-out'],
  duration: ['fast', 'medium', 'slow', 'dramatic'],
  library: ['motion', 'gsap', 'r3f', 'css', 'lenis'],
  style: ['minimal', 'bold', 'playful', 'editorial', 'luxury', 'brutal', 'organic'],
}

const SECTION_COLORS: Record<string, string> = {
  CONTEXT: '#60a5fa',
  COMPONENT_SPEC: '#a78bfa',
  ANIMATION_TOKENS: '#a0ff60',
  VISUAL_REFERENCE: '#fbbf24',
  CODE_CONSTRAINTS: '#f87171',
  OUTPUT_FORMAT: '#22d3ee',
  VALIDATION_CRITERIA: '#888888',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function confidenceColor(conf: number): string {
  if (conf > 0.8) return '#a0ff60'
  if (conf >= 0.6) return '#fbbf24'
  return '#fb923c'
}

function scoreColor(score: number): string {
  if (score > 0.7) return '#a0ff60'
  if (score >= 0.4) return '#fbbf24'
  return '#fb923c'
}

// ---------------------------------------------------------------------------
// Copy button
// ---------------------------------------------------------------------------

function CopyBtn({
  text,
  label = 'Kopiuj',
  sectionId,
}: {
  text: string
  label?: string
  sectionId?: string
}) {
  const { copiedSection, setCopiedSection } = usePromptEngineStore()
  const isCopied = sectionId ? copiedSection === sectionId : false

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    if (sectionId) {
      setCopiedSection(sectionId)
      setTimeout(() => setCopiedSection(null), 2000)
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded px-2 py-1 text-xs font-medium transition-colors"
      style={{
        background: isCopied ? '#a0ff6030' : 'var(--color-surface-elevated)',
        color: isCopied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
      }}
    >
      {isCopied ? 'Skopiowano!' : label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Token chip with dropdown
// ---------------------------------------------------------------------------

function TokenChip({
  tokenKey,
  value,
  confidence,
  onOverride,
}: {
  tokenKey: keyof AnimationTokens
  value: string | number | boolean
  confidence: number
  onOverride: (key: keyof AnimationTokens, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const options = TOKEN_VALUE_OPTIONS[tokenKey]

  return (
    <div className="relative">
      <button
        onClick={() => options && setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors"
        style={{
          background: 'var(--color-surface-elevated)',
          cursor: options ? 'pointer' : 'default',
        }}
      >
        <span style={{ color: 'var(--color-text-secondary)' }}>{tokenKey}:</span>
        <span style={{ color: confidenceColor(confidence) }}>
          {String(value)}
        </span>
        <span
          className="ml-1 inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: confidenceColor(confidence) }}
        />
      </button>
      <AnimatePresence>
        {open && options && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border p-1"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              minWidth: 140,
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onOverride(tokenKey, opt)
                  setOpen(false)
                }}
                className="block w-full rounded px-2 py-1 text-left text-xs transition-colors hover:bg-white/5"
                style={{
                  color:
                    String(value) === opt
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function PromptSection({
  title,
  content,
  color,
  sectionId,
}: {
  title: string
  content: string
  color: string
  sectionId: string
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left"
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-4 w-1 rounded-full"
            style={{ background: color }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={content} label="Kopiuj" sectionId={sectionId} />
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {expanded ? '−' : '+'}
          </span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <pre
              className="overflow-x-auto whitespace-pre-wrap p-4 text-xs leading-relaxed"
              style={{
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {content}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PromptEnginePage() {
  const store = usePromptEngineStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoGenRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [contextOpen, setContextOpen] = useState(false)

  // Debounced parse on input change
  const handleInput = useCallback(
    (text: string) => {
      store.setInputText(text)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (text.trim().length === 0) {
          store.setParsedIntent(null)
          store.setMatches([])
          store.setFrozenPrompt(null)
          return
        }
        const intent = parseIntent(text)
        store.setParsedIntent(intent)
        const matches = findMatches(intent, allAnimations)
        store.setMatches(matches)
        store.setSelectedMatchIndex(0)
      }, 300)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Auto-generate frozen prompt
  useEffect(() => {
    if (autoGenRef.current) clearTimeout(autoGenRef.current)
    if (store.inputText.length > 20 && store.matches.length > 0) {
      autoGenRef.current = setTimeout(() => {
        const match = store.matches[store.selectedMatchIndex]
        if (!match) return
        store.setIsGenerating(true)
        buildFrozenPrompt(match, store.userContext).then((prompt) => {
          store.setFrozenPrompt(prompt)
          store.setIsGenerating(false)
        })
      }, 600)
    }
    return () => {
      if (autoGenRef.current) clearTimeout(autoGenRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.matches, store.selectedMatchIndex, store.inputText])

  // Manual generate
  const handleGenerate = async () => {
    const match = store.matches[store.selectedMatchIndex]
    if (!match) return
    store.setIsGenerating(true)
    const prompt = await buildFrozenPrompt(match, store.userContext)
    store.setFrozenPrompt(prompt)
    store.setIsGenerating(false)
  }

  // Token override
  const handleTokenOverride = (key: keyof AnimationTokens, value: string) => {
    if (!store.parsedIntent) return
    const updated = {
      ...store.parsedIntent,
      tokens: { ...store.parsedIntent.tokens, [key]: key === 'stagger' ? value === 'true' : value },
    }
    store.setParsedIntent(updated)
    const matches = findMatches(updated, allAnimations)
    store.setMatches(matches)
    store.setSelectedMatchIndex(0)
  }

  const intent = store.parsedIntent
  const fp = store.frozenPrompt

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ============ LEFT COLUMN ============ */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1
                className="text-4xl font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Prompt Engine
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Opisz animację — wygeneruję gotowy prompt dla AI
              </p>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={store.inputText}
                onChange={(e) => handleInput(e.target.value)}
                placeholder={
                  'Opisz animację którą sobie wyobrażasz...\n\nNp. \'nagłówek wjeżdża od dołu litera po literze z rozmyciem\''
                }
                className="w-full min-h-[160px] resize-y rounded-xl border p-4 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <span
                className="absolute bottom-3 right-3 text-[10px]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {store.inputText.length}
              </span>
            </div>

            {/* Detected tokens */}
            <AnimatePresence>
              {intent && Object.keys(intent.tokens).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 rounded-xl border p-4"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Wykryte tokeny
                    </h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px]"
                      style={{
                        background: 'var(--color-surface-elevated)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {intent.language === 'pl'
                        ? 'Polski'
                        : intent.language === 'en'
                          ? 'English'
                          : 'Mixed'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.entries(intent.tokens)
                      .filter(([, v]) => v !== undefined)
                      .map(([key, value]) => (
                        <TokenChip
                          key={key}
                          tokenKey={key as keyof AnimationTokens}
                          value={value as string | number | boolean}
                          confidence={intent.confidence[key as keyof AnimationTokens] ?? 0.5}
                          onOverride={handleTokenOverride}
                        />
                      ))}
                  </div>

                  {intent.ambiguous.length > 0 && (
                    <p
                      className="text-xs"
                      style={{ color: '#fbbf24' }}
                    >
                      Niejednoznaczne: {intent.ambiguous.join(', ')}
                    </p>
                  )}
                  {intent.suggestions.length > 0 && (
                    <div className="space-y-1">
                      {intent.suggestions.map((s, i) => (
                        <p
                          key={i}
                          className="text-xs italic"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {s}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Context settings */}
            <div
              className="rounded-xl border"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <button
                onClick={() => setContextOpen(!contextOpen)}
                className="flex w-full items-center gap-2 p-4 text-left text-xs font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span>{contextOpen ? '−' : '+'}</span>
                Ustawienia kontekstu
              </button>
              <AnimatePresence initial={false}>
                {contextOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="space-y-4 px-4 pb-4">
                      {/* Framework */}
                      <div>
                        <label
                          className="mb-1 block text-[10px] uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Framework
                        </label>
                        <select
                          value={store.userContext.framework}
                          onChange={(e) =>
                            store.setUserContext({
                              framework: e.target.value as UserContextFramework,
                            })
                          }
                          className="w-full rounded border px-3 py-1.5 text-xs outline-none"
                          style={{
                            background: 'var(--color-background)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <option value="nextjs">Next.js 16</option>
                          <option value="react">React 19</option>
                          <option value="astro">Astro</option>
                          <option value="vue">Vue 3</option>
                        </select>
                      </div>

                      {/* TypeScript toggle */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          TypeScript
                        </span>
                        <button
                          onClick={() =>
                            store.setUserContext({
                              typescript: !store.userContext.typescript,
                            })
                          }
                          className="rounded-full px-3 py-1 text-[10px] font-bold"
                          style={{
                            background: store.userContext.typescript
                              ? '#a0ff6030'
                              : 'var(--color-surface-elevated)',
                            color: store.userContext.typescript
                              ? 'var(--color-accent)'
                              : 'var(--color-text-secondary)',
                          }}
                        >
                          {store.userContext.typescript ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      {/* Tailwind version */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Tailwind
                        </span>
                        <div className="flex gap-1">
                          {(['3', '4'] as const).map((v) => (
                            <button
                              key={v}
                              onClick={() =>
                                store.setUserContext({ tailwindVersion: v })
                              }
                              className="rounded-full px-3 py-1 text-[10px] font-medium"
                              style={{
                                background:
                                  store.userContext.tailwindVersion === v
                                    ? '#a0ff6030'
                                    : 'var(--color-surface-elevated)',
                                color:
                                  store.userContext.tailwindVersion === v
                                    ? 'var(--color-accent)'
                                    : 'var(--color-text-secondary)',
                              }}
                            >
                              v{v}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Library preference */}
                      <div>
                        <label
                          className="mb-1.5 block text-[10px] uppercase tracking-wider"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Preferowana biblioteka
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {(
                            ['motion', 'gsap', 'r3f', 'css'] as AnimationLibrary[]
                          ).map((lib) => (
                            <button
                              key={lib}
                              onClick={() =>
                                store.setUserContext({ preferredLibrary: lib })
                              }
                              className="rounded-full px-3 py-1 text-[10px] font-medium"
                              style={{
                                background:
                                  store.userContext.preferredLibrary === lib
                                    ? '#a0ff6030'
                                    : 'var(--color-surface-elevated)',
                                color:
                                  store.userContext.preferredLibrary === lib
                                    ? 'var(--color-accent)'
                                    : 'var(--color-text-secondary)',
                              }}
                            >
                              {lib}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={
                store.matches.length === 0 ||
                store.inputText.trim().length === 0 ||
                store.isGenerating
              }
              className="w-full rounded-xl py-3 text-sm font-bold transition-opacity disabled:opacity-30"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-background)',
              }}
            >
              {store.isGenerating ? 'Generowanie...' : 'Generuj Frozen Prompt'}
            </button>

            {/* Matches panel */}
            <AnimatePresence>
              {store.matches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Dopasowania ze słownika ({store.matches.length})
                  </h3>
                  {store.matches.map((m, i) => (
                    <button
                      key={m.entry.id}
                      onClick={() => store.setSelectedMatchIndex(i)}
                      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
                      style={{
                        background: 'var(--color-surface)',
                        borderColor:
                          i === store.selectedMatchIndex
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                      }}
                    >
                      <div className="flex-1">
                        <p
                          className="text-xs font-bold"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          {m.entry.name.en}
                        </p>
                        <p
                          className="mt-0.5 text-[10px]"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {m.matchedTokens.length} tokenów dopasowanych
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 w-16 overflow-hidden rounded-full"
                          style={{ background: 'var(--color-surface-elevated)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round(m.score * 100)}%`,
                              background: scoreColor(m.score),
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{ color: scoreColor(m.score) }}
                        >
                          {Math.round(m.score * 100)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div>
            <AnimatePresence mode="wait">
              {!fp ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div
                    className="mb-4 text-6xl"
                    style={{ color: 'var(--color-border)' }}
                  >
                    {'{ }'}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Wpisz opis animacji po lewej stronie
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="space-y-4"
                >
                  {/* Header bar */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div>
                      <h2
                        className="text-lg font-bold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        Frozen Prompt
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className="rounded px-2 py-0.5 text-[10px]"
                          style={{
                            background: 'var(--color-surface-elevated)',
                            color: 'var(--color-accent)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          # {fp.frozenHash}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {new Date(fp.generatedAt).toLocaleTimeString('pl-PL')}
                        </span>
                      </div>
                    </div>
                    <CopyBtn
                      text={fp.fullPrompt}
                      label="Kopiuj caly prompt"
                      sectionId="__full__"
                    />
                  </div>

                  {/* 7 sections */}
                  {(
                    Object.entries(fp.sections) as [string, string][]
                  ).map(([key, content]) => (
                    <PromptSection
                      key={key}
                      title={key}
                      content={content}
                      color={SECTION_COLORS[key] ?? '#888'}
                      sectionId={key}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// Type helper for framework select
type UserContextFramework = 'nextjs' | 'react' | 'astro' | 'vue'
