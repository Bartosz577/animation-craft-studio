import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export type AnimationConfig = {
  delay: number
  durationOverride?: 'fast' | 'medium' | 'slow' | 'dramatic'
  triggerOverride?: 'onLoad' | 'onScroll' | 'onView' | 'onHover'
  disabled: boolean
}

export type Block = {
  id: string
  componentId: string
  props: Record<string, unknown>
  animationConfig: AnimationConfig
  order: number
}

export type AnimationTheme = 'minimal' | 'bold' | 'editorial' | 'luxury'

type BuilderStore = {
  blocks: Block[]
  selectedBlockId: string | null
  globalTheme: AnimationTheme
  previewMode: boolean

  addBlock: (componentId: string, defaultProps: Record<string, unknown>) => void
  removeBlock: (id: string) => void
  reorderBlocks: (activeId: string, overId: string) => void
  updateBlockProps: (
    id: string,
    props: Partial<Record<string, unknown>>,
  ) => void
  updateBlockAnimation: (id: string, config: Partial<AnimationConfig>) => void
  duplicateBlock: (id: string) => void
  setSelectedBlockId: (id: string | null) => void
  setGlobalTheme: (theme: AnimationTheme) => void
  setPreviewMode: (v: boolean) => void
  getSelectedBlock: () => Block | null
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      blocks: [],
      selectedBlockId: null,
      globalTheme: 'minimal',
      previewMode: false,

      addBlock: (componentId, defaultProps) =>
        set((state) => ({
          blocks: [
            ...state.blocks,
            {
              id: nanoid(),
              componentId,
              props: defaultProps,
              animationConfig: { delay: 0, disabled: false },
              order: state.blocks.length,
            },
          ],
        })),

      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
          selectedBlockId:
            state.selectedBlockId === id ? null : state.selectedBlockId,
        })),

      reorderBlocks: (activeId, overId) =>
        set((state) => {
          const blocks = [...state.blocks]
          const activeIndex = blocks.findIndex((b) => b.id === activeId)
          const overIndex = blocks.findIndex((b) => b.id === overId)
          if (activeIndex === -1 || overIndex === -1) return state
          const [moved] = blocks.splice(activeIndex, 1)
          blocks.splice(overIndex, 0, moved)
          return { blocks: blocks.map((b, i) => ({ ...b, order: i })) }
        }),

      updateBlockProps: (id, props) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, props: { ...b.props, ...props } } : b,
          ),
        })),

      updateBlockAnimation: (id, config) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id
              ? { ...b, animationConfig: { ...b.animationConfig, ...config } }
              : b,
          ),
        })),

      duplicateBlock: (id) =>
        set((state) => {
          const block = state.blocks.find((b) => b.id === id)
          if (!block) return state
          const newBlock = {
            ...block,
            id: nanoid(),
            props: { ...block.props },
            animationConfig: { ...block.animationConfig },
            order: state.blocks.length,
          }
          return { blocks: [...state.blocks, newBlock] }
        }),

      setSelectedBlockId: (id) => set({ selectedBlockId: id }),
      setGlobalTheme: (theme) => set({ globalTheme: theme }),
      setPreviewMode: (v) => set({ previewMode: v }),
      getSelectedBlock: () => {
        const { blocks, selectedBlockId } = get()
        return blocks.find((b) => b.id === selectedBlockId) ?? null
      },
    }),
    { name: 'builder-state' },
  ),
)
