'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { allAnimations } from '@/data/animations'
import type { AnimationCategory, AnimationLibrary, PerformanceCost } from '@/lib/dictionary'
import { categoryColors } from '@/lib/dictionary/category-colors'
import { useLibraryStore } from '@/lib/stores/library-store'
import ComponentCard from '@/components/ui/ComponentCard'

const CATEGORY_LIST: AnimationCategory[] = [
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

const LIBRARY_LIST: AnimationLibrary[] = ['motion', 'gsap', 'r3f', 'css', 'lenis']
const PERFORMANCE_LIST: PerformanceCost[] = ['low', 'medium', 'high', 'webgl']

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="7" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="12" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function LibraryPage() {
  const {
    searchQuery,
    selectedCategories,
    selectedLibraries,
    selectedPerformance,
    viewMode,
    setSearchQuery,
    toggleCategory,
    toggleLibrary,
    togglePerformance,
    setViewMode,
    reset,
  } = useLibraryStore()

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredAnimations = useMemo(() => {
    return allAnimations.filter((entry) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesName =
          entry.name.en.toLowerCase().includes(q) ||
          entry.name.pl.toLowerCase().includes(q)
        const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchesName && !matchesTags) return false
      }

      // Categories
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(entry.category)
      ) {
        return false
      }

      // Libraries
      if (
        selectedLibraries.length > 0 &&
        !entry.libraries.some((l) => selectedLibraries.includes(l.name))
      ) {
        return false
      }

      // Performance
      if (
        selectedPerformance.length > 0 &&
        !selectedPerformance.includes(entry.config.performance)
      ) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedCategories, selectedLibraries, selectedPerformance])

  const activeFilterCount =
    selectedCategories.length +
    selectedLibraries.length +
    selectedPerformance.length

  const categoriesWithCount = useMemo(() => {
    return CATEGORY_LIST.map((c) => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
      count: allAnimations.filter((a) => a.category === c).length,
      color: categoryColors[c],
    })).filter((c) => c.count > 0)
  }, [])

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Szukaj..."
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-primary)',
          outline: 'none',
        }}
      />

      {/* Kategorie */}
      <div>
        <p
          style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Kategorie
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {categoriesWithCount.map((cat) => {
            const isSelected = selectedCategories.includes(cat.value)
            return (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: isSelected
                    ? 'var(--color-surface-elevated)'
                    : 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                }}
              >
                <span
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '0.125rem',
                    border: isSelected
                      ? 'none'
                      : '1px solid var(--color-border)',
                    background: isSelected
                      ? 'var(--color-accent)'
                      : 'transparent',
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Biblioteki */}
      <div>
        <p
          style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Biblioteki
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {LIBRARY_LIST.map((lib) => {
            const isSelected = selectedLibraries.includes(lib)
            return (
              <button
                key={lib}
                onClick={() => toggleLibrary(lib)}
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: '1px solid var(--color-border)',
                  background: isSelected
                    ? 'var(--color-accent)'
                    : 'var(--color-surface)',
                  color: isSelected ? '#050505' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {lib}
              </button>
            )
          })}
        </div>
      </div>

      {/* Wydajnosc */}
      <div>
        <p
          style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Wydajnosc
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {PERFORMANCE_LIST.map((perf) => {
            const isSelected = selectedPerformance.includes(perf)
            return (
              <button
                key={perf}
                onClick={() => togglePerformance(perf)}
                style={{
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: '1px solid var(--color-border)',
                  background: isSelected
                    ? 'var(--color-accent)'
                    : 'var(--color-surface)',
                  color: isSelected ? '#050505' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {perf}
              </button>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={reset}
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-accent)',
            background: 'none',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
        >
          Reset filtrow
        </button>
      )}
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: '3rem 2rem 2rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            Component Library
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              marginTop: '0.5rem',
              fontSize: '0.9375rem',
            }}
          >
            20 komponentow gotowych do uzycia
          </p>
        </div>

        {/* View mode toggle */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              border: 'none',
              cursor: 'pointer',
              background:
                viewMode === 'grid'
                  ? 'var(--color-accent)'
                  : 'var(--color-surface-elevated)',
              color:
                viewMode === 'grid'
                  ? '#050505'
                  : 'var(--color-text-secondary)',
            }}
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="List view"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              border: 'none',
              cursor: 'pointer',
              background:
                viewMode === 'list'
                  ? 'var(--color-accent)'
                  : 'var(--color-surface-elevated)',
              color:
                viewMode === 'list'
                  ? '#050505'
                  : 'var(--color-text-secondary)',
            }}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: 'flex',
          padding: '0 2rem 2rem',
          gap: '2rem',
        }}
      >
        {/* Sidebar - desktop */}
        <aside
          className="hidden lg:block"
          style={{
            width: '15rem',
            flexShrink: 0,
            position: 'sticky',
            top: '6rem',
            alignSelf: 'flex-start',
          }}
        >
          {filterContent}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {filteredAnimations.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredAnimations.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <ComponentCard entry={entry} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                paddingTop: '6rem',
              }}
            >
              <p
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Brak komponentow dla wybranych filtrow
              </p>
              <button
                onClick={reset}
                style={{
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-elevated)',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                }}
              >
                Reset filtrow
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter button */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => setMobileFiltersOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-text-primary)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          Filtry
          {activeFilterCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '9999px',
                background: 'var(--color-accent)',
                color: '#050505',
                fontSize: '0.6875rem',
                fontWeight: 700,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="lg:hidden"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 60,
              }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '80vh',
                overflowY: 'auto',
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                borderRadius: '1rem 1rem 0 0',
                padding: '1.5rem',
                zIndex: 70,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}
                >
                  Filtry
                </h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Zamknij
                </button>
              </div>
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
