import { notFound } from 'next/navigation'
import { site } from '../../site.config'
import { dictionaries, hasLocale, locales } from '../../i18n'
import { WaitlistForm } from './WaitlistForm'

const sampleRows = [
  { bot: 'ChatGPT-User', kind: 'user', page: '/blog/headless-cms-pricing', min: 2, ok: true },
  { bot: 'PerplexityBot', kind: 'search', page: '/docs/getting-started', min: 9, ok: true },
  { bot: 'Claude-User', kind: 'user', page: '/blog/payload-vs-strapi', min: 14, ok: true },
  { bot: 'GPTBot', kind: 'training', page: '/pricing', min: 31, ok: true },
  { bot: 'GPTBot', kind: 'unverified', page: '/wp-login.php', min: 40, ok: false },
] as const

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = dictionaries[lang]
  return (
    <>
      <header className="nav wrap">
        <span className="logo">
          <span className="logo-mark" aria-hidden="true" />
          {site.name}
        </span>
        <div className="nav-right">
          <nav className="langs" aria-label="Language">
            {locales.map((l) => (
              <a key={l} href={`/${l}`} hrefLang={l} aria-current={l === lang ? 'page' : undefined}>
                <span className="hide-sm">{dictionaries[l].langName}</span>
                <span className="show-sm">{dictionaries[l].langShort}</span>
              </a>
            ))}
          </nav>
          <a className="nav-link hide-sm" href={site.repo}>
            {t.nav.openSourcePrefix}
            {t.nav.github}
          </a>
        </div>
      </header>

      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="lede">{t.hero.lede}</p>
            <WaitlistForm source="hero" lang={lang} t={t.form} />
            <p className="fine">{t.hero.fine}</p>
          </div>

          <figure className="panel" aria-label={t.panel.label}>
            <div className="panel-head">
              <span>{t.panel.title}</span>
              <span className="tag">{t.panel.sample}</span>
            </div>
            <div className="stats">
              <div><strong>1,284</strong><span>{t.panel.crawler}</span></div>
              <div><strong>212</strong><span>{t.panel.user}</span></div>
              <div><strong>37</strong><span>{t.panel.referral}</span></div>
            </div>
            <ul className="rows">
              {sampleRows.map((r) => (
                <li key={r.page}>
                  <span className={`dot ${r.ok ? 'dot-ok' : 'dot-bad'}`} aria-hidden="true" />
                  <span className="row-bot">
                    {r.ok ? r.bot : `"${r.bot}" ${t.panel.spoofed}`}
                  </span>
                  <span className={`kind kind-${r.kind}`}>{t.panel.kinds[r.kind]}</span>
                  <span className="row-page">{r.page}</span>
                  <span className="row-when">{t.panel.ago(r.min)}</span>
                </li>
              ))}
            </ul>
          </figure>
        </section>

        <section className="band">
          <div className="wrap">
            <h2>{t.problem.title}</h2>
            <p className="section-lede">{t.problem.lede}</p>
            <div className="questions">
              {t.problem.questions.map((q) => (
                <p key={q}>{q}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap section">
          <h2>{t.cloud.title}</h2>
          <p className="section-lede">{t.cloud.lede}</p>
          <div className="grid">
            {t.cloud.features.map((f) => (
              <div className="card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section split">
          <div>
            <h2>{t.oss.title}</h2>
            <p className="section-lede">{t.oss.lede}</p>
            <ul className="checks">
              {t.oss.shipped.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="code">
            <div className="code-head">{t.oss.codeHead}</div>
            <pre>
              <code>{`npm i payload-plugin-geo @garus-ltd/geo-next
# ${t.oss.codeOr}
npm i strapi-plugin-geo @garus-ltd/geo-next`}</code>
            </pre>
            <a className="code-link" href={site.repo}>{t.oss.docs}</a>
          </div>
        </section>

        <section className="wrap section">
          <h2>{t.faq.title}</h2>
          <div className="faq">
            {t.faq.items.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="wrap section cta">
          <h2>{t.cta.title}</h2>
          <p className="section-lede">{t.cta.lede}</p>
          <WaitlistForm source="footer" lang={lang} t={t.form} compact />
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} {site.shortName}</span>
        <a href={site.repo}>GitHub</a>
      </footer>
    </>
  )
}
