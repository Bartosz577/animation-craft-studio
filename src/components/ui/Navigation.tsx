'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'

const NAV_LINKS = [
  { href: '/dictionary', label: 'Dictionary' },
  { href: '/prompt-engine', label: 'Prompt Engine' },
  { href: '/library', label: 'Library' },
  { href: '/builder', label: 'Builder' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const direction = y > lastScrollY.current ? 'down' : 'up'
    if (direction === 'down' && y > 80 && !mobileOpen) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setScrolled(y > 20)
    lastScrollY.current = y
  })

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -64 : 0 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          height: 64,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(5, 5, 5, 0.8)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            padding: '0 24px',
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--color-accent)',
              }}
            >
              ACS
            </span>
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-accent)',
              }}
            />
          </Link>

          {/* Center nav links — hidden on mobile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    position: 'relative',
                    padding: '8px 14px',
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 14,
                        right: 14,
                        height: 2,
                        borderRadius: 1,
                        background: 'var(--color-accent)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 8,
                color: 'var(--color-text-secondary)',
                transition: 'color 0.2s ease',
              }}
              className="hidden md:flex"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = 'var(--color-text-primary)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'var(--color-text-secondary)')
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* CTA — hidden on mobile */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:block"
            >
              <Link
                href="/prompt-engine"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--color-accent)',
                  color: '#050505',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Zacznij
              </Link>
            </motion.div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                padding: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Menu"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 7 }
                    : { rotate: 0, y: 0 }
                }
                style={{
                  display: 'block',
                  width: 20,
                  height: 2,
                  background: 'var(--color-text-primary)',
                  borderRadius: 1,
                }}
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                style={{
                  display: 'block',
                  width: 20,
                  height: 2,
                  background: 'var(--color-text-primary)',
                  borderRadius: 1,
                }}
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0 }
                }
                style={{
                  display: 'block',
                  width: 20,
                  height: 2,
                  background: 'var(--color-text-primary)',
                  borderRadius: 1,
                }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'var(--color-background)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 24,
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              ✕
            </button>

            {NAV_LINKS.map((link, i) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: isActive
                        ? 'var(--color-accent)'
                        : 'var(--color-text-primary)',
                      textDecoration: 'none',
                      padding: '8px 0',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              style={{ marginTop: 24 }}
            >
              <Link
                href="/prompt-engine"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  borderRadius: 12,
                  background: 'var(--color-accent)',
                  color: '#050505',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Zacznij
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
