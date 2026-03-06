'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { allAnimations } from '@/data/animations'
import type {
  AnimationEntry,
  AnimationCategory,
  AnimationLibrary,
  PerformanceCost,
} from '@/lib/dictionary'
import { getCategoryColor } from '@/lib/dictionary'
import { AnimationCard } from '@/components/ui/AnimationCard'
import { AnimationDetailModal } from '@/components/ui/AnimationDetailModal'

const categories: AnimationCategory[] = [
  'entrance',
  'exit',
  'scroll',
  'hover',
  'typography',
  'loop',
  'transition',
  'micro-interaction',
  'gestural',
  '3d',
  'shader',
]

const libraryFilters: AnimationLibrary[] = ['motion', 'gsap', 'r3f', 'css']
const perfFilters: PerformanceCost[] = ['low', 'medium', 'high', 'webgl']

// Only show categories present in data
const activeCategories = categories.filter((cat) =>
  allAnimations.some((a) => a.category === cat),
)

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1
      className="text-4xl font-bold md:text-5xl"
      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: i * 0.02,
            ease: [0.19, 1, 0.22, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </h1>
  )
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
      style={{
        background: active ? (color ?? 'var(--color-accent)') + '30' : 'var(--color-surface)',
        color: active ? (color ?? 'var(--color-accent)') : 'var(--color-text-secondary)',
        border: `1px solid ${active ? (color ?? 'var(--color-accent)') + '40' : 'var(--color-border)'}`,
      }}
    >
      {color && (
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </button>
  )
}

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AnimationCategory | null>(null)
  const [selectedLibrary, setSelectedLibrary] = useState<AnimationLibrary | null>(null)
  const [selectedPerformance, setSelectedPerformance] = useState<PerformanceCost | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<AnimationEntry | null>(null)

  const hasFilters = searchQuery || selectedCategory || selectedLibrary || selectedPerformance

  const filtered = useMemo(() => {
    let result = allAnimations

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.en.toLowerCase().includes(q) ||
          a.name.pl.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory)
    }

    if (selectedLibrary) {
      result = result.filter((a) =>
        a.libraries.some((l) => l.name === selectedLibrary),
      )
    }

    if (selectedPerformance) {
      result = result.filter((a) => a.config.performance === selectedPerformance)
    }

    return result
  }, [searchQuery, selectedCategory, selectedLibrary, selectedPerformance])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedLibrary(null)
    setSelectedPerformance(null)
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-background)' }}
    >
      {/* Hero */}
      <div className="px-6 pt-16 pb-8 md:px-12">
        <AnimatedTitle text="Animation Dictionary" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="mt-4 text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {allAnimations.length} animacji gotowych do użycia
        </motion.p>
      </div>

      {/* Filter bar */}
      <div
        className="sticky top-0 z-40 border-b px-6 py-4 md:px-12"
        style={{
          background: 'color-mix(in srgb, var(--color-background) 80%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Szukaj animacji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 text-sm outline-none md:w-80"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <FilterPill
              label="Wszystkie"
              active={!selectedCategory}
              onClick={() => setSelectedCategory(null)}
            />
            {activeCategories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                color={getCategoryColor(cat)}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
              />
            ))}
          </div>

          {/* Library + Performance + Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {libraryFilters.map((lib) => (
              <FilterPill
                key={lib}
                label={lib}
                active={selectedLibrary === lib}
                onClick={() =>
                  setSelectedLibrary(selectedLibrary === lib ? null : lib)
                }
              />
            ))}
            <span
              className="mx-1 text-xs"
              style={{ color: 'var(--color-border)' }}
            >
              |
            </span>
            {perfFilters.map((p) => (
              <FilterPill
                key={p}
                label={p}
                active={selectedPerformance === p}
                onClick={() =>
                  setSelectedPerformance(selectedPerformance === p ? null : p)
                }
              />
            ))}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-2 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: '#f8717118',
                  color: '#f87171',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-8 md:px-12">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((entry) => (
                <AnimationCard
                  key={entry.id}
                  entry={entry}
                  onClick={setSelectedEntry}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p
              className="text-center text-lg"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Brak wyników dla tych filtrów
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimationDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  )
}
