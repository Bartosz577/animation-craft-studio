'use client'

import { useCallback } from 'react'

/* ------------------------------------------------------------------ */
/*  Prop definition types                                              */
/* ------------------------------------------------------------------ */

type PropDef = {
  type: 'number' | 'boolean' | 'select' | 'string' | 'color'
  label: string
  min?: number
  max?: number
  step?: number
  options?: string[]
}

/* ------------------------------------------------------------------ */
/*  Component props metadata — maps componentId → editable props       */
/* ------------------------------------------------------------------ */

const COMPONENT_PROPS_META: Record<string, Record<string, PropDef>> = {
  'hero-sequence': {
    delay: { type: 'number', label: 'Opóźnienie (s)', min: 0, max: 3, step: 0.1 },
  },
  'text-split-reveal-up': {
    text: { type: 'string', label: 'Tekst' },
    delay: { type: 'number', label: 'Opóźnienie (s)', min: 0, max: 3, step: 0.1 },
    as: { type: 'select', label: 'Element HTML', options: ['h1', 'h2', 'h3', 'p', 'span'] },
  },
  'text-scramble': {
    text: { type: 'string', label: 'Tekst' },
    trigger: { type: 'select', label: 'Wyzwalacz', options: ['mount', 'hover', 'inView'] },
  },
  'magnetic-button': {
    strength: { type: 'number', label: 'Siła przyciągania', min: 0, max: 1, step: 0.1 },
  },
  'parallax-image': {
    speed: { type: 'number', label: 'Prędkość', min: 0, max: 1, step: 0.1 },
    direction: { type: 'select', label: 'Kierunek', options: ['up', 'down'] },
  },
  'stagger-grid-reveal': {
    staggerDelay: { type: 'number', label: 'Opóźnienie stagger (s)', min: 0, max: 0.5, step: 0.01 },
  },
  'cursor-trail': {
    color: { type: 'color', label: 'Kolor' },
    size: { type: 'number', label: 'Rozmiar (px)', min: 2, max: 20, step: 1 },
    count: { type: 'number', label: 'Liczba punktów', min: 3, max: 20, step: 1 },
  },
  'page-transition': {},
  'floating-particles': {
    count: { type: 'number', label: 'Liczba cząsteczek', min: 5, max: 50, step: 1 },
    color: { type: 'color', label: 'Kolor' },
    size: { type: 'number', label: 'Rozmiar (px)', min: 1, max: 10, step: 1 },
  },
  'glitch-text': {
    text: { type: 'string', label: 'Tekst' },
    active: { type: 'boolean', label: 'Aktywny' },
  },
  'liquid-hover': {
    fillColor: { type: 'color', label: 'Kolor wypełnienia' },
  },
  'tilt-3d-card': {
    maxTilt: { type: 'number', label: 'Maks. pochylenie (°)', min: 5, max: 45, step: 1 },
  },
  'counter-up': {
    target: { type: 'number', label: 'Wartość docelowa', min: 0, max: 10000, step: 1 },
    prefix: { type: 'string', label: 'Prefiks' },
    suffix: { type: 'string', label: 'Sufiks' },
    duration: { type: 'number', label: 'Czas trwania (s)', min: 0.5, max: 5, step: 0.5 },
  },
  'horizontal-scroll': {},
  'pin-section': {},
  'typewriter-text': {
    text: { type: 'string', label: 'Tekst' },
    speed: { type: 'number', label: 'Szybkość (ms/znak)', min: 10, max: 200, step: 10 },
    cursor: { type: 'boolean', label: 'Kursor' },
  },
  'glow-border': {
    glowColor: { type: 'color', label: 'Kolor glow' },
    borderRadius: { type: 'string', label: 'Border radius' },
  },
  'stagger-list': {
    staggerDelay: { type: 'number', label: 'Opóźnienie stagger (s)', min: 0, max: 0.5, step: 0.01 },
    direction: { type: 'select', label: 'Kierunek', options: ['up', 'down', 'left', 'right'] },
  },
  'splash-screen': {
    duration: { type: 'number', label: 'Czas trwania (ms)', min: 500, max: 5000, step: 100 },
  },
  'morphing-shape': {
    color: { type: 'color', label: 'Kolor' },
    animate: { type: 'boolean', label: 'Animuj' },
  },
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PropsEditorProps {
  componentId: string
  propValues: Record<string, unknown>
  onChange: (key: string, value: unknown) => void
}

/* ------------------------------------------------------------------ */
/*  Inline styles (shared)                                             */
/* ------------------------------------------------------------------ */

const styles = {
  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '8px 10px',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    outline: 'none',
  } as React.CSSProperties,

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  } as React.CSSProperties,
}

/* ------------------------------------------------------------------ */
/*  Field renderers                                                    */
/* ------------------------------------------------------------------ */

function NumberField({
  def,
  value,
  onChange,
}: {
  def: PropDef
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div style={styles.fieldGroup}>
      <span style={styles.label}>{def.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="range"
          min={def.min ?? 0}
          max={def.max ?? 100}
          step={def.step ?? 1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: 'var(--color-accent)',
            height: 4,
            cursor: 'pointer',
          }}
        />
        <input
          type="number"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            ...styles.input,
            width: 72,
            textAlign: 'right' as const,
            padding: '6px 8px',
          }}
        />
      </div>
    </div>
  )
}

function BooleanField({
  def,
  value,
  onChange,
}: {
  def: PropDef
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      style={{
        ...styles.fieldGroup,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ ...styles.label, marginBottom: 0 }}>{def.label}</span>
      <div
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onChange(!value)
          }
        }}
        style={{
          position: 'relative',
          width: 40,
          height: 22,
          borderRadius: 11,
          background: value ? 'var(--color-accent)' : 'var(--color-border)',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 21 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: value ? 'var(--color-background)' : 'var(--color-text-secondary)',
            transition: 'left 0.2s ease, background 0.2s ease',
          }}
        />
      </div>
    </div>
  )
}

function SelectField({
  def,
  value,
  onChange,
}: {
  def: PropDef
  value: string
  onChange: (v: string) => void
}) {
  const options = def.options ?? []

  return (
    <div style={styles.fieldGroup}>
      <span style={styles.label}>{def.label}</span>
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {options.map((opt) => {
          const isSelected = opt === value
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              style={{
                flex: 1,
                padding: '7px 6px',
                background: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                color: isSelected ? 'var(--color-background)' : 'var(--color-text-secondary)',
                border: 'none',
                borderRight: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: isSelected ? 700 : 400,
                transition: 'background 0.15s ease, color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StringField({
  def,
  value,
  onChange,
}: {
  def: PropDef
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={styles.fieldGroup}>
      <span style={styles.label}>{def.label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  )
}

function ColorField({
  def,
  value,
  onChange,
}: {
  def: PropDef
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={styles.fieldGroup}>
      <span style={styles.label}>{def.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 36,
            height: 36,
            padding: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...styles.input,
            flex: 1,
          }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PropsEditor({ componentId, propValues, onChange }: PropsEditorProps) {
  const meta = COMPONENT_PROPS_META[componentId]
  const entries = meta ? Object.entries(meta) : []

  const handleChange = useCallback(
    (key: string) => (value: unknown) => {
      onChange(key, value)
    },
    [onChange],
  )

  if (!meta || entries.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
        }}
      >
        Brak edytowalnych właściwości
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 16 }}>
      {entries.map(([key, def]) => {
        const val = propValues[key]

        switch (def.type) {
          case 'number':
            return (
              <NumberField
                key={key}
                def={def}
                value={(val as number) ?? def.min ?? 0}
                onChange={handleChange(key)}
              />
            )
          case 'boolean':
            return (
              <BooleanField
                key={key}
                def={def}
                value={(val as boolean) ?? false}
                onChange={handleChange(key)}
              />
            )
          case 'select':
            return (
              <SelectField
                key={key}
                def={def}
                value={(val as string) ?? def.options?.[0] ?? ''}
                onChange={handleChange(key)}
              />
            )
          case 'string':
            return (
              <StringField
                key={key}
                def={def}
                value={(val as string) ?? ''}
                onChange={handleChange(key)}
              />
            )
          case 'color':
            return (
              <ColorField
                key={key}
                def={def}
                value={(val as string) ?? '#ffffff'}
                onChange={handleChange(key)}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
