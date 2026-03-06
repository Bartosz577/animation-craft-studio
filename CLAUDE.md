# Animation Craft Studio — Claude Code Context

## Project Overview
Animation Craft Studio is a web tool for building award-level animated
websites. It transforms natural language descriptions into ready-to-use
animation code components and AI-ready frozen prompts.

## Architecture — 4 Modules
1. **Animation Dictionary** — Visual encyclopedia of animations (/app/dictionary)
2. **Prompt Engine** — NLP text → structured frozen prompt (/app/prompt-engine)
3. **Component Library** — 20+ ready-made animation components (/app/library)
4. **Block Builder** — Drag & drop page compositor (/app/builder)

## Tech Stack
- Next.js 16.1 (App Router, TypeScript, Turbopack)
- React 19.2
- Tailwind CSS v4 (CSS-first, no tailwind.config.js)
- Motion v12 (primary animation library for UI and components)
- GSAP 3 + ScrollTrigger (complex timelines, scroll-driven, text splitting)
- Lenis 1.3 (smooth scroll, integrates with GSAP ticker)
- React Three Fiber 9 + Drei + Postprocessing (3D/WebGL — v9 required for React 19 compat)
- Zustand 5 (global state)
- Zod (schema validation)
- Storybook 8 (component isolation)

## Key Design Decisions
- GSAP is used for scroll-driven animations and complex timelines ONLY
- Motion is the DEFAULT library for all UI animations and simple components
- Never mix Motion and GSAP in the same component without explicit reason
- ALL animations must have prefers-reduced-motion static fallback
- Never hardcode animation values — always use CSS variables or props
- TypeScript strict mode — no 'any' types allowed

## CSS Design Tokens (globals.css)
- --color-background: #050505
- --color-accent: #a0ff60 (signature electric green)
- --font-display: 'Syne'
- --duration-fast: 0.3s | --duration-medium: 0.6s | --duration-slow: 1s
- --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)
- --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)

## Folder Structure
/src/app                    → Next.js App Router pages
/src/components/animations  → 20 animation components
/src/components/ui          → UI components (cards, modals, nav)
/src/lib/dictionary         → Types and dictionary logic
/src/lib/prompt-engine      → NLP parser, slot mapper, prompt builder
/src/lib/builder            → Block builder logic, exporters
/src/lib/stores             → Zustand stores
/src/data/animations        → 20 AnimationEntry data files
/stories                    → Storybook stories
/tests                      → Vitest unit tests + Playwright e2e

## Development Rules (ALWAYS FOLLOW)
1. Types first → Data → Logic → UI (never skip this order)
2. Run `npx tsc --noEmit` after every implementation — zero errors required
3. Every component must be in its own file with named exports
4. Every animation component exports FROZEN_PROMPT as a named string constant
5. Commit after each working module with conventional commits:
   feat(module): description
6. Never generate placeholder components — everything must work immediately
7. All new pages use Motion for enter/exit animations

## Frozen Prompt Structure (7 mandatory sections)
Every frozen prompt MUST contain:
[CONTEXT] [COMPONENT_SPEC] [ANIMATION_TOKENS] [VISUAL_REFERENCE]
[CODE_CONSTRAINTS] [OUTPUT_FORMAT] [VALIDATION_CRITERIA]

## Animation Token System (9 tokens — always all filled)
element | trigger | type | direction | stagger | easing | duration | library | style

## Current Phase
Update this section as you progress:
- [x] Phase 0: Project setup
- [ ] Phase 1: Animation Dictionary
- [ ] Phase 2: Prompt Engine
- [ ] Phase 3: Component Library
- [ ] Phase 4: Block Builder
- [ ] Phase 5: Polish & Launch

## Git Conventions
- Branch: main (single branch for now)
- Commit format: feat(scope): description
- Commit after every completed phase step
- Never commit broken TypeScript

## Known Constraints
- GSAP has Webflow license restriction — verify before SaaS launch
- Motion is MIT licensed — safe for all uses
- WebGL components have high performance cost — always badge them clearly
- Target browsers: Chrome 120+, Firefox 121+, Safari 17+
- .npmrc has legacy-peer-deps=true because Storybook 8 hasn't declared Next.js 16 in peer deps yet — don't remove it
