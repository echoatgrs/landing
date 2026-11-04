'use client'

import { useId, useState } from 'react'
import type { Dictionary } from '../../i18n'

// Stored in English so the sheet stays comparable across languages.
const ROLE_VALUES = ['Agency', 'In-house marketing / SEO', 'Developer', 'Founder']
// Stable values stored in the sheet; labels come from the dictionary in the same order.
const INDUSTRY_VALUES = ['E-commerce', 'SaaS', 'B2B / manufacturing', 'Local services', 'Education', 'Healthcare', 'Finance', 'Media']

type State = 'idle' | 'sending' | 'done' | 'error'

export function WaitlistForm({
  source,
  lang,
  t,
  onRed = false,
  className = '',
  style,
}: {
  source: string
  lang: string
  t: Dictionary['form']
  onRed?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const id = useId()
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, source, lang }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || t.genericError)
      }
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.genericError)
      setState('error')
    }
  }

  const cls = `form${onRed ? ' on-red' : ''} ${className}`

  if (state === 'done') {
    return (
      <div className={cls} style={style}>
        <div className="form-done" role="status">
          <strong>{t.doneTitle}</strong>
          {t.doneBody}
        </div>
      </div>
    )
  }

  return (
    <form className={cls} style={style} onSubmit={onSubmit}>
      <label className="mono-label" htmlFor={`${id}-email`}>{t.emailLabel}</label>
      <div className="form-row">
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder={t.emailPlaceholder} />
        <button type="submit" className="pill" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : t.submit}
        </button>
      </div>
      <details>
        <summary>{t.more}</summary>
        <div className="form-extra">
          <label>
            <span className="lbl">{t.siteLabel}</span>
            <input name="site" type="text" inputMode="url" placeholder="example.com" />
          </label>
          <Chips legend={t.industryLabel} name="industry" options={[...t.industries.map((v, i) => [INDUSTRY_VALUES[i], v]), ['Other', t.other]]} />
          <Chips legend={t.roleLabel} name="role" options={[...t.roles.map((r, i) => [ROLE_VALUES[i], r]), ['Other', t.other]]} />
        </div>
      </details>
      {/* Honeypot: people never see or fill this. */}
      <input className="hp" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === 'error' && <p className="form-error" role="alert">{error}</p>}
    </form>
  )
}

function Chips({ legend, name, options }: { legend: string; name: string; options: string[][] }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="chips">
        {options.map(([value, label]) => (
          <label key={value}>
            <input type="radio" name={name} value={value} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
