import { create } from 'zustand'
import type { AnimationCategory, AnimationLibrary, PerformanceCost } from '@/lib/dictionary'

type LibraryStore = {
  searchQuery: string
  selectedCategories: AnimationCategory[]
  selectedLibraries: AnimationLibrary[]
  selectedPerformance: PerformanceCost[]
  viewMode: 'grid' | 'list'
  setSearchQuery: (q: string) => void
  toggleCategory: (c: AnimationCategory) => void
  toggleLibrary: (l: AnimationLibrary) => void
  togglePerformance: (p: PerformanceCost) => void
  setViewMode: (mode: 'grid' | 'list') => void
  reset: () => void
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  searchQuery: '',
  selectedCategories: [],
  selectedLibraries: [],
  selectedPerformance: [],
  viewMode: 'grid',
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleCategory: (c) =>
    set((s) => ({
      selectedCategories: s.selectedCategories.includes(c)
        ? s.selectedCategories.filter((x) => x !== c)
        : [...s.selectedCategories, c],
    })),
  toggleLibrary: (l) =>
    set((s) => ({
      selectedLibraries: s.selectedLibraries.includes(l)
        ? s.selectedLibraries.filter((x) => x !== l)
        : [...s.selectedLibraries, l],
    })),
  togglePerformance: (p) =>
    set((s) => ({
      selectedPerformance: s.selectedPerformance.includes(p)
        ? s.selectedPerformance.filter((x) => x !== p)
        : [...s.selectedPerformance, p],
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  reset: () =>
    set({
      searchQuery: '',
      selectedCategories: [],
      selectedLibraries: [],
      selectedPerformance: [],
    }),
}))
