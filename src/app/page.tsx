'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const FEATURES = [
  {
    href: '/dictionary',
    icon: '\uD83D\uDCD6',
    title: 'Slownik animacji',
    desc: '20 typow animacji z tokenami i podgladem',
  },
  {
    href: '/prompt-engine',
    icon: '\u26A1',
    title: 'Prompt Engine',
    desc: 'NLP parser i frozen prompt generator',
  },
  {
    href: '/library',
    icon: '\uD83E\uDDE9',
    title: 'Biblioteka komponentow',
    desc: '20 production-ready React components',
  },
  {
    href: '/builder',
    icon: '\uD83C\uDFD7\uFE0F',
    title: 'Block Builder',
    desc: 'Drag & drop page builder z eksportem',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
  },
}

export default function Home() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: 'var(--color-accent)',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          Animation Craft Studio
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          Narzedzie do budowania animowanych stron klasy award-level
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          maxWidth: 640,
          width: '100%',
        }}
      >
        {FEATURES.map((f) => (
          <motion.div key={f.href} variants={itemVariants}>
            <Link
              href={f.href}
              style={{
                display: 'block',
                padding: '1.5rem',
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--color-text-primary)',
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                {f.title}
              </h2>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  fontSize: '0.75rem',
                  color: 'var(--color-accent)',
                }}
              >
                Otwórz →
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
