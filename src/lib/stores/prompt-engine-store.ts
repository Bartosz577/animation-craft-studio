import { create } from 'zustand'
import type { ParsedIntent } from '@/lib/prompt-engine'
import type { Match } from '@/lib/prompt-engine'
import type { FrozenPrompt, UserContext } from '@/lib/prompt-engine'

type PromptEngineStore = {
  inputText: string
  setInputText: (text: string) => void

  parsedIntent: ParsedIntent | null
  setParsedIntent: (intent: ParsedIntent | null) => void

  matches: Match[]
  setMatches: (matches: Match[]) => void
  selectedMatchIndex: number
  setSelectedMatchIndex: (index: number) => void

  userContext: UserContext
  setUserContext: (ctx: Partial<UserContext>) => void

  frozenPrompt: FrozenPrompt | null
  setFrozenPrompt: (prompt: FrozenPrompt | null) => void

  isGenerating: boolean
  setIsGenerating: (v: boolean) => void
  copiedSection: string | null
  setCopiedSection: (section: string | null) => void
}

export const usePromptEngineStore = create<PromptEngineStore>((set) => ({
  inputText: '',
  setInputText: (text) => set({ inputText: text }),

  parsedIntent: null,
  setParsedIntent: (intent) => set({ parsedIntent: intent }),

  matches: [],
  setMatches: (matches) => set({ matches }),
  selectedMatchIndex: 0,
  setSelectedMatchIndex: (index) => set({ selectedMatchIndex: index }),

  userContext: {
    framework: 'nextjs',
    frameworkVersion: '16.1',
    typescript: true,
    tailwindVersion: '4',
    preferredLibrary: 'motion',
  },
  setUserContext: (ctx) =>
    set((state) => ({ userContext: { ...state.userContext, ...ctx } })),

  frozenPrompt: null,
  setFrozenPrompt: (prompt) => set({ frozenPrompt: prompt }),

  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  copiedSection: null,
  setCopiedSection: (section) => set({ copiedSection: section }),
}))
