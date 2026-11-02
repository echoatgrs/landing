'use client'

import { useId, useState } from 'react'
import type { Dictionary } from '../../i18n'

// Stored in English so the sheet stays comparable across languages.
const ROLE_VALUES = ['Agency', 'In-house marketing / SEO', 'Developer', 'Founder']
const CMS = ['Payload', 'Strapi', 'Sanity', 'Contentful', 'WordPress (headless)']

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
            <span>{t.siteLabel}</span>
            <input name="site" type="text" inputMode="url" placeholder="example.com" />
          </label>
          <label>
            <span>{t.cmsLabel}</span>
            <select name="cms" defaultValue="">
              <option value="">{t.choose}</option>
              {CMS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">{t.other}</option>
            </select>
          </label>
          <label>
            <span>{t.roleLabel}</span>
            <select name="role" defaultValue="">
              <option value="">{t.choose}</option>
              {t.roles.map((r, i) => (
                <option key={r} value={ROLE_VALUES[i]}>{r}</option>
              ))}
              <option value="Other">{t.other}</option>
            </select>
          </label>
        </div>
      </details>
      {/* Honeypot: people never see or fill this. */}
      <input className="hp" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === 'error' && <p className="form-error" role="alert">{error}</p>}
    </form>
  )
}
