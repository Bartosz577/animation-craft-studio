# Animation Craft Studio

> Narzędzie do budowania animowanych stron klasy award-level z pomocą AI

## Moduły
| Moduł | Opis | Route |
|-------|------|-------|
| Animation Dictionary | Wizualny słownik 20 animacji | /dictionary |
| Prompt Engine | NLP → Frozen Prompt | /prompt-engine |
| Component Library | 20 gotowych komponentów | /library |
| Block Builder | Drag & drop compositor | /builder |

## Stack
Next.js 16.1 · React 19.2 · TypeScript 5 · Motion v12 · GSAP 3 · Lenis 1.x · Tailwind CSS v4 · Zustand 5 · Zod · @dnd-kit · Storybook 8 · Vitest

## Development
```bash
npm install
npm run dev        # localhost:3000
npm run storybook  # localhost:6006
npm run test       # vitest
npm run build      # production build
```

## Deploy
1. vercel.com/new
2. Import repo: animation-craft-studio
3. Click Deploy — zero config needed

## Architektura
```
src/
├── app/                    # Next.js pages (/, /dictionary, /prompt-engine, /library, /builder)
├── components/
│   ├── animations/         # 20 animation components z FROZEN_PROMPT
│   ├── ui/                 # AnimationCard, ComponentPreview, PropsEditor, Toast...
│   └── providers/          # LenisProvider
├── lib/
│   ├── dictionary/         # Types, Zod schemas, category colors
│   ├── prompt-engine/      # NLP parser, slot mapper, prompt builder
│   ├── builder/            # Conflict detector, 3 exporters
│   └── stores/             # 3 Zustand stores
└── data/animations/        # 20 AnimationEntry data files
```
