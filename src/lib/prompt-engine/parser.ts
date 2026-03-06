import type { AnimationTokens } from '@/lib/dictionary'
import type { ParsedIntent, KeywordMap } from './types'

// ---------------------------------------------------------------------------
// Keyword dictionaries
// ---------------------------------------------------------------------------

const elementKeywords: KeywordMap<AnimationTokens['element']>[] = [
  { keywords: ['nagłówek', 'tytuł', 'h1', 'h2', 'heading', 'title', 'headline'], value: 'heading', weight: 0.9 },
  { keywords: ['hero', 'baner', 'banner', 'główna sekcja', 'top sekcja'], value: 'hero', weight: 0.9 },
  { keywords: ['sekcja', 'section', 'blok', 'block', 'obszar'], value: 'section', weight: 0.8 },
  { keywords: ['karta', 'card', 'kafelek', 'tile', 'panel'], value: 'card', weight: 0.9 },
  { keywords: ['obraz', 'obrazek', 'zdjęcie', 'photo', 'image', 'img', 'foto'], value: 'image', weight: 0.9 },
  { keywords: ['przycisk', 'button', 'btn', 'cta', 'link'], value: 'button', weight: 0.9 },
  { keywords: ['nawigacja', 'navigation', 'nav', 'menu'], value: 'nav', weight: 0.9 },
  { keywords: ['tekst', 'text', 'treść', 'content', 'paragraf', 'paragraph', 'akapit'], value: 'text', weight: 0.8 },
  { keywords: ['lista', 'list', 'elementy', 'items'], value: 'list', weight: 0.85 },
  { keywords: ['siatka', 'grid', 'galeria', 'gallery', 'kolumny', 'columns'], value: 'grid', weight: 0.9 },
]

const triggerKeywords: KeywordMap<AnimationTokens['trigger']>[] = [
  { keywords: ['ładowanie', 'wejście', 'start', 'load', 'initial', 'początkowo', 'po załadowaniu'], value: 'onLoad', weight: 0.85 },
  { keywords: ['scroll', 'przewijanie', 'podczas scrollowania', 'przy scrollu', 'on scroll', 'scrollowania'], value: 'onScroll', weight: 0.9 },
  { keywords: ['hover', 'najechanie', 'po najechaniu', 'mouseover', 'po hoverze', 'hoverze', 'przy hoverze'], value: 'onHover', weight: 0.9 },
  { keywords: ['kliknięcie', 'click', 'po kliknięciu', 'on click'], value: 'onClick', weight: 0.9 },
  { keywords: ['widoczny', 'pojawi się', 'wejdzie w widok', 'viewport', 'in view', 'gdy widoczny'], value: 'onView', weight: 0.85 },
]

const typeKeywords: KeywordMap<AnimationTokens['type']>[] = [
  { keywords: ['fade', 'pojawia się', 'zanika', 'opacity', 'przeźroczystość', 'przyciemnienie', 'fades'], value: 'fade', weight: 0.8 },
  { keywords: ['wjeżdża', 'wchodzi', 'slide', 'przesuwa się', 'wsuwa', 'wlatuje', 'wchodzą'], value: 'slide', weight: 0.85 },
  { keywords: ['powiększa', 'rośnie', 'scale', 'zoom', 'skaluje', 'scaling'], value: 'scale', weight: 0.85 },
  { keywords: ['rozmycie', 'blur', 'rozmyty', 'rozmazany', 'unblur', 'rozmyciem'], value: 'blur', weight: 0.85 },
  { keywords: ['odkrywa się', 'clip', 'reveal', 'wycięcie', 'zasłona', 'curtain'], value: 'clip', weight: 0.85 },
  { keywords: ['litera po literze', 'znak po znaku', 'split', 'rozdzielony', 'każda litera'], value: 'split', weight: 0.95 },
  { keywords: ['miesza się', 'scramble', 'losowe znaki', 'chaos', 'szyfr', 'dekodowanie'], value: 'scramble', weight: 0.9 },
  { keywords: ['fala', 'wave', 'faluje', 'ondulacja'], value: 'wave', weight: 0.9 },
  { keywords: ['magnetyczny', 'magnetic', 'przyciąga', 'odpycha', 'przyciąganie'], value: 'magnetic', weight: 0.9 },
  { keywords: ['cząsteczki', 'particles', 'particle', 'drobinki', 'kulki', 'punkciki'], value: 'particle', weight: 0.9 },
  { keywords: ['glitch', 'usterka', 'błąd', 'rgb', 'trzęsie się', 'psucie'], value: 'glitch', weight: 0.9 },
  { keywords: ['obrót', 'rotate', 'kręci się', 'obraca'], value: 'rotate', weight: 0.85 },
  { keywords: ['morph', 'zmienia kształt', 'transformuje', 'morphing'], value: 'morph', weight: 0.85 },
  { keywords: ['3d', 'trójwymiarowy', 'trójwymiarowa', 'perspektywa'], value: '3d', weight: 0.95 },
]

const directionKeywords: KeywordMap<AnimationTokens['direction']>[] = [
  { keywords: ['od dołu', 'z dołu', 'w górę', 'bottom', 'upward', 'wjeżdża od dołu'], value: 'up', weight: 0.9 },
  { keywords: ['od góry', 'z góry', 'w dół', 'top', 'downward', 'opada'], value: 'down', weight: 0.9 },
  { keywords: ['od prawej', 'z prawej', 'w lewo', 'from right', 'right to left'], value: 'left', weight: 0.9 },
  { keywords: ['od lewej', 'z lewej', 'w prawo', 'from left', 'left to right'], value: 'right', weight: 0.9 },
  { keywords: ['ze środka', 'od środka', 'center', 'środek', 'centralnie'], value: 'center', weight: 0.85 },
  { keywords: ['radialnie', 'radial', 'promieniście', 'okrągło'], value: 'radial', weight: 0.9 },
]

const staggerTrueKeywords: string[] = [
  'kolejno', 'po kolei', 'stopniowo', 'jedno po drugim', 'stagger',
  'z opóźnieniem', 'sekwencja', 'każde osobno',
  'litera po literze', 'znak po znaku',
]

const staggerFalseKeywords: string[] = [
  'jednocześnie', 'razem', 'naraz', 'wszystko na raz', 'together',
]

const easingKeywords: KeywordMap<AnimationTokens['easing']>[] = [
  { keywords: ['sprężyna', 'spring', 'odbicie', 'elastyczny', 'bounce back', 'spring physics'], value: 'spring', weight: 0.9 },
  { keywords: ['gwałtownie zwalnia', 'expo', 'dynamicznie', 'szybko potem wolno'], value: 'expo-out', weight: 0.85 },
  { keywords: ['płynnie', 'smooth', 'naturalnie', 'miękko'], value: 'ease-in-out', weight: 0.75 },
  { keywords: ['elastic', 'gumowy', 'rozciągliwy', 'z przerzutem'], value: 'elastic', weight: 0.9 },
  { keywords: ['bounce', 'odbija', 'podskakuje'], value: 'bounce', weight: 0.9 },
  { keywords: ['liniowo', 'linear', 'równomiernie', 'stała prędkość'], value: 'linear', weight: 0.85 },
]

const durationKeywords: KeywordMap<AnimationTokens['duration']>[] = [
  { keywords: ['szybko', 'błyskawicznie', 'fast', 'szybka', 'krótko', 'natychmiastowo'], value: 'fast', weight: 0.9 },
  { keywords: ['średnio', 'medium', 'normalnie', 'standardowo'], value: 'medium', weight: 0.8 },
  { keywords: ['wolno', 'powoli', 'slow', 'płynnie', 'spokojnie'], value: 'slow', weight: 0.85 },
  { keywords: ['dramatycznie', 'bardzo wolno', 'dramatic', 'majestatycznie', 'efektownie'], value: 'dramatic', weight: 0.9 },
]

const libraryKeywords: KeywordMap<AnimationTokens['library']>[] = [
  { keywords: ['motion', 'framer', 'react spring'], value: 'motion', weight: 0.9 },
  { keywords: ['gsap', 'greensock', 'timeline', 'tween'], value: 'gsap', weight: 0.9 },
  { keywords: ['css', 'tylko css', 'pure css', 'bez javascript', 'animacja css'], value: 'css', weight: 0.9 },
  { keywords: ['3d', 'three.js', 'webgl', 'r3f', 'three', 'trójwymiarowy'], value: 'r3f', weight: 0.85 },
]

const styleKeywords: KeywordMap<AnimationTokens['style']>[] = [
  { keywords: ['minimalistyczny', 'subtelny', 'delikatny', 'minimal', 'czysty', 'clean'], value: 'minimal', weight: 0.85 },
  { keywords: ['mocny', 'wyrazisty', 'bold', 'odważny', 'silny', 'striking'], value: 'bold', weight: 0.85 },
  { keywords: ['zabawny', 'playful', 'wesoły', 'dynamiczny', 'energiczny'], value: 'playful', weight: 0.85 },
  { keywords: ['edytorski', 'editorial', 'magazynowy', 'prasowy', 'typograficzny'], value: 'editorial', weight: 0.85 },
  { keywords: ['luksusowy', 'luxury', 'elegancki', 'premium', 'ekskluzywny'], value: 'luxury', weight: 0.85 },
  { keywords: ['brutalny', 'brutal', 'surowy', 'raw', 'agresywny'], value: 'brutal', weight: 0.85 },
  { keywords: ['organiczny', 'organic', 'naturalny', 'płynny', 'miękki'], value: 'organic', weight: 0.8 },
]

// ---------------------------------------------------------------------------
// Polish word list for language detection
// ---------------------------------------------------------------------------

const polishIndicators = [
  'się', 'jest', 'nie', 'na', 'od', 'do', 'po', 'ze', 'za', 'przy',
  'już', 'jak', 'ale', 'gdy', 'lub', 'albo', 'też', 'tylko', 'być',
  'który', 'która', 'które', 'tego', 'tej', 'tym', 'ten', 'ta', 'to',
  'nagłówek', 'sekcja', 'przycisk', 'tekst', 'karta', 'obraz', 'zdjęcie',
  'podczas', 'każda', 'każde', 'litera', 'kolejno', 'wolno', 'szybko',
  'wjeżdża', 'pojawia', 'obraca', 'wchodzi', 'odkrywa', 'tle',
]

const englishIndicators = [
  'the', 'is', 'of', 'and', 'in', 'on', 'at', 'to', 'for', 'with',
  'from', 'that', 'this', 'but', 'not', 'are', 'was', 'has', 'have',
  'heading', 'section', 'button', 'image', 'card', 'text',
  'scroll', 'hover', 'load', 'view', 'click',
  'fade', 'slide', 'scale', 'blur', 'clip', 'reveal',
  'slow', 'fast', 'dramatic', 'smooth',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[.,!?;:()"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectLanguage(text: string): 'pl' | 'en' | 'mixed' {
  const words = text.toLowerCase().split(/\s+/)
  let plScore = 0
  let enScore = 0

  for (const word of words) {
    if (polishIndicators.includes(word)) plScore++
    if (englishIndicators.includes(word)) enScore++
  }

  if (plScore === 0 && enScore === 0) return 'mixed'
  if (plScore > 0 && enScore === 0) return 'pl'
  if (enScore > 0 && plScore === 0) return 'en'
  if (plScore > enScore * 2) return 'pl'
  if (enScore > plScore * 2) return 'en'
  return 'mixed'
}

type MatchResult<T extends string> = {
  value: T
  confidence: number
  alternates: T[]
}

function matchKeywords<T extends string>(
  input: string,
  maps: KeywordMap<T>[],
  preferLast = false,
): MatchResult<T> | null {
  const hits: { value: T; score: number; position: number }[] = []

  for (const map of maps) {
    let bestScore = 0
    let bestPosition = -1

    for (const keyword of map.keywords) {
      // Multi-word exact phrase match
      if (keyword.includes(' ')) {
        const idx = input.indexOf(keyword)
        if (idx !== -1) {
          if (map.weight > bestScore || (map.weight === bestScore && idx > bestPosition)) {
            bestScore = map.weight
            bestPosition = idx
          }
        }
      } else {
        // Single-word: try exact word boundary match first
        const wordBoundary = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i')
        const match = wordBoundary.exec(input)
        if (match) {
          if (map.weight > bestScore || (map.weight === bestScore && match.index > bestPosition)) {
            bestScore = map.weight
            bestPosition = match.index
          }
        } else {
          const idx = input.indexOf(keyword)
          if (idx !== -1) {
            // Substring (partial) match
            const partialScore = map.weight * 0.7
            if (partialScore > bestScore || (partialScore === bestScore && idx > bestPosition)) {
              bestScore = partialScore
              bestPosition = idx
            }
          }
        }
      }
    }

    if (bestScore > 0) {
      hits.push({ value: map.value, score: bestScore, position: bestPosition })
    }
  }

  if (hits.length === 0) return null

  // Sort descending by score, then by position (later = preferred when preferLast)
  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return preferLast ? b.position - a.position : 0
  })

  const best = hits[0]
  const alternates = hits
    .slice(1)
    .filter((h) => h.value !== best.value)
    .map((h) => h.value)

  return {
    value: best.value,
    confidence: best.score,
    alternates,
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchStagger(input: string): { value: boolean; confidence: number } {
  let trueScore = 0
  let falseScore = 0

  for (const kw of staggerTrueKeywords) {
    if (input.includes(kw)) {
      trueScore = Math.max(trueScore, 0.9)
    }
  }

  for (const kw of staggerFalseKeywords) {
    if (input.includes(kw)) {
      falseScore = Math.max(falseScore, 0.9)
    }
  }

  if (trueScore > falseScore) return { value: true, confidence: trueScore }
  if (falseScore > trueScore) return { value: false, confidence: falseScore }
  return { value: false, confidence: 0.5 }
}

// ---------------------------------------------------------------------------
// Token name labels for suggestion generation
// ---------------------------------------------------------------------------

const tokenLabels: Record<keyof AnimationTokens, string> = {
  element: 'element',
  trigger: 'wyzwalacz',
  type: 'typ animacji',
  direction: 'kierunek',
  stagger: 'sekwencyjność',
  staggerDelay: 'opóźnienie staggera',
  easing: 'easing',
  duration: 'czas trwania',
  library: 'biblioteka',
  style: 'styl',
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseIntent(input: string): ParsedIntent {
  const raw = input
  const normalized = normalize(input)
  const language = detectLanguage(normalized)

  const tokens: Partial<AnimationTokens> = {}
  const confidence: Partial<Record<keyof AnimationTokens, number>> = {}
  const ambiguous: (keyof AnimationTokens)[] = []
  const suggestions: string[] = []

  // Element — prefer last match when scores tie (e.g. "hero image" → image)
  const elementMatch = matchKeywords(normalized, elementKeywords, true)
  if (elementMatch) {
    tokens.element = elementMatch.value
    confidence.element = elementMatch.confidence
    if (elementMatch.confidence < 0.6) {
      ambiguous.push('element')
      if (elementMatch.alternates.length > 0) {
        suggestions.push(
          `Czy element to '${elementMatch.value}' czy '${elementMatch.alternates[0]}'?`,
        )
      }
    }
  }

  // Trigger
  const triggerMatch = matchKeywords(normalized, triggerKeywords)
  if (triggerMatch) {
    tokens.trigger = triggerMatch.value
    confidence.trigger = triggerMatch.confidence
    if (triggerMatch.confidence < 0.6) {
      ambiguous.push('trigger')
    }
  }

  // Type
  const typeMatch = matchKeywords(normalized, typeKeywords)
  if (typeMatch) {
    tokens.type = typeMatch.value
    confidence.type = typeMatch.confidence
    if (typeMatch.confidence < 0.6) {
      ambiguous.push('type')
      if (typeMatch.alternates.length > 0) {
        suggestions.push(
          `Czy chodziło Ci o animację '${typeMatch.value}' czy '${typeMatch.alternates[0]}'?`,
        )
      }
    }
  }

  // Direction
  const directionMatch = matchKeywords(normalized, directionKeywords)
  if (directionMatch) {
    tokens.direction = directionMatch.value
    confidence.direction = directionMatch.confidence
    if (directionMatch.confidence < 0.6) {
      ambiguous.push('direction')
    }
  }

  // Stagger
  const staggerResult = matchStagger(normalized)
  tokens.stagger = staggerResult.value
  confidence.stagger = staggerResult.confidence
  if (staggerResult.confidence < 0.6) {
    ambiguous.push('stagger')
  }

  // Easing
  const easingMatch = matchKeywords(normalized, easingKeywords)
  if (easingMatch) {
    tokens.easing = easingMatch.value
    confidence.easing = easingMatch.confidence
    if (easingMatch.confidence < 0.6) {
      ambiguous.push('easing')
    }
  }

  // Duration
  const durationMatch = matchKeywords(normalized, durationKeywords)
  if (durationMatch) {
    tokens.duration = durationMatch.value
    confidence.duration = durationMatch.confidence
    if (durationMatch.confidence < 0.6) {
      ambiguous.push('duration')
    }
  }

  // Library
  const libraryMatch = matchKeywords(normalized, libraryKeywords)
  if (libraryMatch) {
    tokens.library = libraryMatch.value
    confidence.library = libraryMatch.confidence
    if (libraryMatch.confidence < 0.6) {
      ambiguous.push('library')
    }
  }

  // Style
  const styleMatch = matchKeywords(normalized, styleKeywords)
  if (styleMatch) {
    tokens.style = styleMatch.value
    confidence.style = styleMatch.confidence
    if (styleMatch.confidence < 0.6) {
      ambiguous.push('style')
    }
  }

  // Generate suggestions for missing important tokens
  const importantTokens: (keyof AnimationTokens)[] = ['element', 'type', 'trigger']
  for (const token of importantTokens) {
    if (!(token in tokens)) {
      suggestions.push(`Nie rozpoznano ${tokenLabels[token]} — spróbuj doprecyzować.`)
    }
  }

  return {
    raw,
    language,
    tokens,
    confidence,
    ambiguous,
    suggestions,
  }
}
