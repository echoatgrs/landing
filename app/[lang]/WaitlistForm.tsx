'use client'

import { useState } from 'react'
import type { Dictionary } from '../../i18n'

const ROLE_VALUES = ['Agency', 'In-house marketing / SEO', 'Developer', 'Founder']

type State = 'idle' | 'sending' | 'done' | 'error'

export function WaitlistForm({
  source,
  lang,
  t,
  compact = false,
}: {
  source: string
  lang: string
  t: Dictionary['form']
  compact?: boolean
}) {
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

  if (state === 'done') {
    return (
      <div className="form-done" role="status">
        <strong>{t.doneTitle}</strong> {t.doneBody}
      </div>
    )
  }

  return (
    <form className={compact ? 'form form-compact' : 'form'} onSubmit={onSubmit} noValidate={false}>
      <div className="form-row">
        <label className="sr-only" htmlFor={`email-${source}`}>{t.emailLabel}</label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
        />
        <button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : t.submit}
        </button>
      </div>
      {!compact && (
        <div className="form-extra">
          <label>
            <span>{t.siteLabel}</span>
            <input name="site" type="text" inputMode="url" placeholder="example.com" />
          </label>
          <label>
            <span>{t.cmsLabel}</span>
            <select name="cms" defaultValue="">
              <option value="">{t.choose}</option>
              <option>Payload</option>
              <option>Strapi</option>
              <option>Sanity</option>
              <option>Contentful</option>
              <option>WordPress (headless)</option>
              <option value="Other">{t.other}</option>
            </select>
          </label>
          <label>
            <span>{t.roleLabel}</span>
            <select name="role" defaultValue="">
              <option value="">{t.choose}</option>
              {t.roles.map((r, i) => (
                // Store the English value so the sheet stays comparable across languages.
                <option key={r} value={ROLE_VALUES[i]}>{r}</option>
              ))}
              <option value="Other">{t.other}</option>
            </select>
          </label>
        </div>
      )}
      {/* Honeypot: real people never see or fill this. */}
      <input className="hp" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === 'error' && <p className="form-error" role="alert">{error}</p>}
    </form>
  )
}
