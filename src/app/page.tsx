'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import FloatingParticles from '@/components/animations/FloatingParticles'
import CounterUp from '@/components/animations/CounterUp'
import TypewriterText from '@/components/animations/TypewriterText'
import GlowBorder from '@/components/animations/GlowBorder'
import MorphingShape from '@/components/animations/MorphingShape'

/* ─────────────────────── helpers ─────────────────────── */

function Section({
  children,
  className,
  style,
  bg,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  bg?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section ref={ref} style={{ background: bg, ...style }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}

function SplitText({
  text,
  className,
  delay = 0,
  accentWord,
}: {
  text: string
  className?: string
  delay?: number
  accentWord?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const words = text.split(' ')
  let charIndex = 0

  return (
    <span ref={ref} className={className} style={{ display: 'block' }}>
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}
        >
          {word.split('').map((char, ci) => {
            const idx = charIndex++
            return (
              <motion.span
                key={`${wi}-${ci}`}
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: delay + idx * 0.025,
                  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
                }}
                style={{
                  display: 'inline-block',
                  color:
                    accentWord && word === accentWord
                      ? 'var(--color-accent)'
                      : undefined,
                }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

function FeatureList({ items, delay = 0 }: { items: string[]; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <div
      ref={ref}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{
            delay: delay + i * 0.1,
            duration: 0.4,
            ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
          }}
          style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  )
}

function MockCard({
  name,
  cat,
  color,
  type,
  delay,
}: {
  name: string
  cat: string
  color: string
  type: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -4 }}
      style={{
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 100,
          background: 'var(--color-background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {type}
        </span>
      </div>
      <div style={{ padding: 12 }}>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {name}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: 6,
            padding: '2px 8px',
            borderRadius: 9999,
            fontSize: '0.625rem',
            background: color + '18',
            color,
          }}
        >
          {cat}
        </span>
      </div>
    </motion.div>
  )
}

function TokenChips() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const tokens = [
    'ELEMENT: heading',
    'TYPE: split',
    'DIRECTION: up',
    'STAGGER: true',
    'EASING: expo-out',
    'DURATION: medium',
    'LIBRARY: motion',
    'TRIGGER: onView',
    'STYLE: editorial',
  ]
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            delay: 0.5 + i * 0.08,
            duration: 0.3,
            ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
          }}
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 9999,
            background: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
            fontSize: '0.6875rem',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {token}
        </motion.span>
      ))}
    </div>
  )
}

function MockLibCard({
  name,
  cat,
  color,
  perf,
  delay,
}: {
  name: string
  cat: string
  color: string
  perf: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -4 }}
      style={{
        minWidth: 280,
        flexShrink: 0,
        borderRadius: 12,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
      }}
    >
      <div
        style={{
          height: 100,
          background: 'var(--color-background)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          preview
        </span>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: '0.625rem',
              background: color + '18',
              color,
            }}
          >
            {cat}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.625rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: perf === 'high' ? '#34d399' : '#fbbf24',
                display: 'inline-block',
              }}
            />
            {perf}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function MockBlock({
  name,
  color,
  delay,
}: {
  name: string
  color: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={
        inView ? { opacity: 1, x: 0, y: [0, -4, 0] } : {}
      }
      transition={
        inView
          ? {
              opacity: { delay, duration: 0.5 },
              x: {
                delay,
                duration: 0.5,
                ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
              },
              y: {
                delay: delay + 0.5,
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : {}
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface-elevated)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <span
        style={{
          color: 'var(--color-text-secondary)',
          cursor: 'grab',
          fontSize: '1rem',
        }}
      >
        &#x2807;&#x2807;
      </span>
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}
      >
        {name}
      </span>
    </motion.div>
  )
}

/* ─────────────────────── page ─────────────────────── */

export default function Home() {
  return (
    <div>
      {/* ═══════════ SECTION 1 — HERO ═══════════ */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <FloatingParticles count={20} color="#a0ff6030" size={2} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, #a0ff6015, transparent)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            padding: '80px 1.5rem 0',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 9999,
              border: '1px solid rgba(160,255,96,0.3)',
              background: 'rgba(160,255,96,0.1)',
              color: 'var(--color-accent)',
              fontSize: '0.75rem',
              marginBottom: 32,
            }}
          >
            Narzedzie dla tworcow stron klasy Awwwards
          </motion.div>

          {/* Headlines */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 1,
              margin: 0,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
              }}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                whiteSpace: 'nowrap',
              }}
            >
              Animation Craft
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.7,
                ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
              }}
              style={{
                fontSize: 'clamp(3rem, 10vw, 7rem)',
                whiteSpace: 'nowrap',
                color: 'var(--color-accent)',
              }}
            >
              Studio
            </motion.div>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.2,
              duration: 0.6,
              ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
            }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: 600,
              margin: '24px auto 0',
            }}
          >
            Transformuj opisy animacji na gotowy kod — identyczny w kazdym chatbocie AI
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              marginTop: 40,
              flexWrap: 'wrap',
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/prompt-engine"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  borderRadius: 12,
                  background: 'var(--color-accent)',
                  color: '#050505',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                }}
              >
                Otworz Prompt Engine &rarr;
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/library"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-accent)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--color-border)')
                }
              >
                Zobacz biblioteke komponentow
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          <div style={{ fontSize: '1.25rem' }}>&darr;</div>
          <div
            style={{ fontSize: '0.6875rem', marginTop: 4, letterSpacing: '0.1em' }}
          >
            scroll
          </div>
        </motion.div>
      </section>

      {/* ═══════════ SECTION 2 — STATS STRIP ═══════════ */}
      <Section
        bg="var(--color-surface)"
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            padding: '48px 24px',
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            textAlign: 'center',
          }}
        >
          {[
            { target: 20, suffix: '', label: 'gotowych komponentow' },
            { target: 9, suffix: '', label: 'tokenow animacji' },
            { target: 4, suffix: '', label: 'zintegrowane moduly' },
            { target: 95, suffix: '%', label: 'zgodnosc Claude Sonnet 4.6' },
          ].map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: 'var(--color-accent)',
                }}
              >
                <CounterUp target={stat.target} suffix={stat.suffix} duration={2} />
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ SECTION 3 — DICTIONARY FEATURE ═══════════ */}
      <Section style={{ padding: '128px 24px' }}>
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 px-6">
          {/* Left text */}
          <div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
              }}
            >
              Modul 01
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: 'var(--color-text-primary)',
                marginTop: 12,
                lineHeight: 1.1,
              }}
            >
              Slownik
              <br />
              Animacji
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Encyklopedia wizualna wszystkich efektow animacyjnych z pelnymi tokenami,
              podgladem na zywo i fragmentami promptow.
            </p>
            <FeatureList
              items={[
                '20 gotowych wpisow z podgladem na zywo',
                'Filtrowanie po kategorii, bibliotece i wydajnosci',
                'Kazdy wpis z fragmentem gotowego prompta',
              ]}
            />
            <Link
              href="/dictionary"
              style={{
                display: 'inline-block',
                marginTop: 24,
                fontSize: '0.875rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Otworz slownik &rarr;
            </Link>
          </div>

          {/* Right: mock dictionary grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {[
              {
                name: 'Text Split Reveal',
                cat: 'typography',
                color: '#fbbf24',
                type: 'split',
              },
              {
                name: 'Magnetic Button',
                cat: 'hover',
                color: '#a78bfa',
                type: 'magnetic',
              },
              {
                name: 'Parallax Image',
                cat: 'scroll',
                color: '#34d399',
                type: 'fade',
              },
            ].map((card, i) => (
              <MockCard key={i} {...card} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ SECTION 4 — PROMPT ENGINE FEATURE ═══════════ */}
      <Section
        bg="var(--color-surface)"
        style={{
          padding: '128px 24px',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 px-6">
          {/* Left: mock UI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Typewriter panel */}
            <div
              style={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-background)',
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}
              >
                input
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.6,
                }}
              >
                <TypewriterText
                  text="naglowek wjezdza od dolu litera po literze"
                  speed={40}
                />
              </div>
            </div>

            {/* Token chips panel */}
            <div
              style={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-background)',
                padding: 20,
              }}
            >
              <div
                style={{
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 12,
                }}
              >
                parsed tokens
              </div>
              <TokenChips />
            </div>
          </div>

          {/* Right: text */}
          <div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
              }}
            >
              Modul 02
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: 'var(--color-text-primary)',
                marginTop: 12,
                lineHeight: 1.1,
              }}
            >
              Prompt
              <br />
              Engine
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Opisz animacje swoimi slowami — NLP parser zamieni je na ustrukturyzowane
              tokeny i wygeneruje frozen prompt gotowy do wklejenia w dowolny chatbot AI.
            </p>
            <FeatureList
              items={[
                'NLP parser rozpoznaje elementy, typy i parametry',
                'Frozen prompts zapewniaja powtarzalnosc wynikow',
                'Eksport do schowka jednym kliknieciem',
              ]}
            />
            <Link
              href="/prompt-engine"
              style={{
                display: 'inline-block',
                marginTop: 24,
                fontSize: '0.875rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Otworz Prompt Engine &rarr;
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════════ SECTION 5 — LIBRARY FEATURE ═══════════ */}
      <Section style={{ padding: '128px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
            }}
          >
            Modul 03
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: 'var(--color-text-primary)',
              marginTop: 12,
              lineHeight: 1.1,
            }}
          >
            Biblioteka Komponentow
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginTop: 16,
              lineHeight: 1.6,
              maxWidth: 560,
              margin: '16px auto 0',
            }}
          >
            20 production-ready komponentow React z podgladem na zywo, kodem zrodlowym
            i frozen promptem do natychmiastowego uzycia.
          </p>
        </div>

        {/* Horizontal scrolling row */}
        <div
          style={{
            maxWidth: 1200,
            margin: '48px auto 0',
            overflowX: 'auto',
            display: 'flex',
            gap: 16,
            padding: '8px 24px 24px',
            scrollSnapType: 'x mandatory',
          }}
        >
          {[
            {
              name: 'FloatingParticles',
              cat: 'ambient',
              color: '#a0ff60',
              perf: 'high',
            },
            {
              name: 'TextSplitReveal',
              cat: 'typography',
              color: '#fbbf24',
              perf: 'high',
            },
            {
              name: 'MagneticButton',
              cat: 'hover',
              color: '#a78bfa',
              perf: 'high',
            },
            {
              name: 'ParallaxSection',
              cat: 'scroll',
              color: '#34d399',
              perf: 'medium',
            },
            {
              name: 'GlitchText',
              cat: 'typography',
              color: '#f472b6',
              perf: 'high',
            },
            {
              name: 'MorphingShape',
              cat: 'decorative',
              color: '#60a5fa',
              perf: 'high',
            },
          ].map((card, i) => (
            <MockLibCard key={i} {...card} delay={i * 0.1} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href="/library"
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Przegladaj wszystkie komponenty &rarr;
          </Link>
        </div>
      </Section>

      {/* ═══════════ SECTION 6 — BUILDER FEATURE ═══════════ */}
      <Section
        bg="var(--color-surface)"
        style={{
          padding: '128px 24px',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 px-6">
          {/* Left: text */}
          <div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
              }}
            >
              Modul 04
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: 'var(--color-text-primary)',
                marginTop: 12,
                lineHeight: 1.1,
              }}
            >
              Block
              <br />
              Builder
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-secondary)',
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Przeciagaj gotowe bloki animacyjne, ukladaj je w sekcje i eksportuj
              kompletny kod strony — bez pisania ani jednej linii.
            </p>
            <FeatureList
              items={[
                'Drag & drop interface z podgladem na zywo',
                'Gotowe bloki: hero, features, stats, CTA',
                'Eksport do czystego kodu React/Next.js',
              ]}
            />
            <Link
              href="/builder"
              style={{
                display: 'inline-block',
                marginTop: 24,
                fontSize: '0.875rem',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Otworz Builder &rarr;
            </Link>
          </div>

          {/* Right: mock builder canvas */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--color-border)',
              background: 'var(--color-background)',
            }}
          >
            <div
              style={{
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-text-secondary)',
                marginBottom: 8,
              }}
            >
              canvas
            </div>
            <MockBlock name="Hero — Split Reveal" color="#a0ff60" delay={0} />
            <MockBlock name="Stats Strip — Counter Up" color="#fbbf24" delay={0.15} />
            <MockBlock name="Features — Stagger List" color="#a78bfa" delay={0.3} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
              <MorphingShape
                color="var(--color-accent)"
                animate
                className="w-16 h-16 opacity-20"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ SECTION 7 — FINAL CTA ═══════════ */}
      <Section style={{ padding: '160px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <GlowBorder glowColor="var(--color-accent)" borderRadius="16px">
            <div style={{ padding: '48px 32px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                  color: 'var(--color-text-primary)',
                  margin: 0,
                }}
              >
                Zacznij budowac dzis
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginTop: 12,
                  fontSize: '1rem',
                }}
              >
                Darmowe narzedzie. Zero rejestracji.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'center',
                  marginTop: 32,
                  flexWrap: 'wrap',
                }}
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/prompt-engine"
                    style={{
                      display: 'inline-block',
                      padding: '14px 28px',
                      borderRadius: 12,
                      background: 'var(--color-accent)',
                      color: '#050505',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Otworz Prompt Engine &rarr;
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/library"
                    style={{
                      display: 'inline-block',
                      padding: '14px 28px',
                      borderRadius: 12,
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Biblioteka komponentow
                  </Link>
                </motion.div>
              </div>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginTop: 24,
                  fontSize: '0.75rem',
                }}
              >
                Dziala z Claude, ChatGPT, Gemini, Cursor AI
              </p>
            </div>
          </GlowBorder>
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        style={{ borderTop: '1px solid var(--color-border)', padding: '64px 24px' }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--color-accent)',
                fontSize: '1.125rem',
              }}
            >
              ACS
            </span>
            <span
              style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}
            >
              &copy; 2026 Animation Craft Studio
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Zbudowane z Motion, GSAP, React Three Fiber
          </span>
        </div>
      </footer>
    </div>
  )
}
