import type { AnimationEntry } from '@/lib/dictionary'

// Typography
import { textSplitRevealUp } from './text-split-reveal-up'
import { textScramble } from './text-scramble'
import { textWave } from './text-wave'
import { textMagnetic } from './text-magnetic'
import { textBlurFadeIn } from './text-blur-fade-in'

// Entrance
import { slideUpFade } from './slide-up-fade'
import { scaleInCenter } from './scale-in-center'
import { clipRevealHorizontal } from './clip-reveal-horizontal'
import { staggerGridReveal } from './stagger-grid-reveal'
import { heroSequence } from './hero-sequence'

// Scroll
import { parallaxImage } from './parallax-image'
import { pinSection } from './pin-section'
import { scrubTextReveal } from './scrub-text-reveal'
import { horizontalScroll } from './horizontal-scroll'
import { counterUp } from './counter-up'

// Hover
import { magneticButton } from './magnetic-button'
import { tilt3dCard } from './tilt-3d-card'
import { liquidHover } from './liquid-hover'
import { glowBorder } from './glow-border'
import { cursorTrail } from './cursor-trail'

export const allAnimations: AnimationEntry[] = [
  // Typography
  textSplitRevealUp,
  textScramble,
  textWave,
  textMagnetic,
  textBlurFadeIn,
  // Entrance
  slideUpFade,
  scaleInCenter,
  clipRevealHorizontal,
  staggerGridReveal,
  heroSequence,
  // Scroll
  parallaxImage,
  pinSection,
  scrubTextReveal,
  horizontalScroll,
  counterUp,
  // Hover
  magneticButton,
  tilt3dCard,
  liquidHover,
  glowBorder,
  cursorTrail,
]

export function getAnimationById(id: string): AnimationEntry | undefined {
  return allAnimations.find((a) => a.id === id)
}

// Re-export individual entries
export {
  textSplitRevealUp,
  textScramble,
  textWave,
  textMagnetic,
  textBlurFadeIn,
  slideUpFade,
  scaleInCenter,
  clipRevealHorizontal,
  staggerGridReveal,
  heroSequence,
  parallaxImage,
  pinSection,
  scrubTextReveal,
  horizontalScroll,
  counterUp,
  magneticButton,
  tilt3dCard,
  liquidHover,
  glowBorder,
  cursorTrail,
}
