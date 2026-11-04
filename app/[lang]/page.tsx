import { notFound } from 'next/navigation'
import { site } from '../../site.config'
import { dictionaries, hasLocale, locales } from '../../i18n'
import { CHART, CITATIONS, GAP, GAP_OF, SITES } from './demo'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'
import { WaitlistForm } from './WaitlistForm'

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = dictionaries[lang]
  const h = t.soon

  return (
    <>
      <header className="topbar">
        <div className="wrap top">
          <a href={`/${lang}`} className="logo">
            <LogoMark size={26} />
            {site.shortName.toUpperCase()}
          </a>
          <nav aria-label="Language" className="mono-label">
            {locales.map((l) => (
              <a key={l} href={`/${l}`} hrefLang={l} lang={l} aria-current={l === lang ? 'page' : undefined}>
                {dictionaries[l].langShort}
              </a>
            ))}
            <a className="gh" href={site.repo}>GitHub</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="layer dots" />
          <div className="wrap hero-in">
            <div className="badge mono-label rise" style={{ animationDelay: '.1s' }}>
              <span className="rdot blink" aria-hidden="true" />
              <span>{t.hero.badge}</span>
            </div>
            <h1 className="dotfont h-in" style={{ animationDelay: '.2s' }}>
              {t.hero.titleLines[0]}
              <br />
              {t.hero.titleLines[1]}
              <span className="mark">{t.hero.titleMark}</span>
            </h1>
            <div className="hero-row">
              <p className="lede rise" style={{ animationDelay: '.5s' }}>{t.hero.lede}</p>
              <WaitlistForm source="hero" lang={lang} t={t.form} className="rise" style={{ animationDelay: '.7s' }} />
            </div>
          </div>
        </section>

        <section className="marquee" aria-label={t.marqueeLabel}>
          <div className="marq marquee-track">
            {[...t.marquee, ...t.marquee].map((b, i) => (
              <span key={i} aria-hidden={i >= t.marquee.length ? true : undefined}>
                {b}
                <i className="rdot" />
              </span>
            ))}
          </div>
        </section>

        <section className="wrap section">
          <div className="sec-head">
            <h2 className="dotfont">
              {h.titleLines[0]}
              <br />
              {h.titleLines[1]}
            </h2>
            <p>{h.lede}</p>
          </div>

          <div className="cards">
            {/* 01 citation monitoring */}
            <Reveal className="card wide soft">
              <CardHead n="01" title={h.citations.title} body={h.citations.body} preview={h.tag} />
              <div className="cite-wrap">
                <div className="note dark cite-q">
                  <div className="note-head mono-label">
                    <span>{h.citations.qLabel}</span>
                    <span>{h.citations.qTime}</span>
                  </div>
                  <p><strong>{h.citations.q}</strong></p>
                </div>
                <div className="diag cite-list">
                  {h.citations.names.map((name, ci) => {
                    const rank = CITATIONS[ci]
                    return (
                      <div key={name}>
                        <span className="p">{name}</span>
                        <span className={`chip ${rank ? (rank === 1 ? 'red' : 'ink') : 'ok'}`}>
                          {rank ? `${h.citations.cited} #${rank}` : h.citations.notCited}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>

            {/* 02 read but never cited */}
            <Reveal className="card">
              <CardHead n="02" title={h.gap.title} body={h.gap.body} preview={h.tag} />
              <div className="diag gap-list bottom">
                <div className="head mono-label">
                  <span>{h.gap.cols[0]}</span>
                  <span>{h.gap.cols[1]}</span>
                  <span>{h.gap.cols[2]}</span>
                </div>
                {GAP.map(([path, reads, cited]) => (
                  <div key={path}>
                    <span className="p">{path}</span>
                    <span className="n">{reads}</span>
                    <span className={`chip ${cited ? 'ink' : 'red'}`}>{cited ? `${cited}/${GAP_OF}` : h.gap.notCited}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 03 weekly brief and alerts */}
            <Reveal className="card">
              <CardHead n="03" title={h.alerts.title} body={h.alerts.body} preview={h.tag} />
              <div className="notes bottom">
                <div className="note dark notif" style={{ animationDelay: '.2s' }}>
                  <div className="note-head mono-label">
                    <span><span className="blink" style={{ color: 'var(--red-on-dark)' }}>●</span> {site.shortName}</span>
                    <span>{h.alerts.n1Time}</span>
                  </div>
                  <p><strong>{h.alerts.n1Title}</strong><span>{h.alerts.n1Body}</span></p>
                </div>
                <div className="note notif" style={{ animationDelay: '.6s' }}>
                  <div className="note-head mono-label">
                    <span>{site.shortName}</span>
                    <span>{h.alerts.n2Time}</span>
                  </div>
                  <p><strong>{h.alerts.n2Title}</strong><span>{h.alerts.n2Body}</span></p>
                </div>
              </div>
            </Reveal>

            {/* 04 all sites */}
            <Reveal className="card wide dark">
              <div className="layer dots-dark" />
              <CardHead n="04" title={h.sites.title} body={h.sites.body} preview={h.tag} />
              <div className="chart-wrap">
                <div className="chart-box">
                  <div className="chart-head mono-label">
                    <span>{h.sites.chart}</span>
                    <span>
                      <b>●</b> {h.sites.user} · ● {h.sites.crawler}
                    </span>
                  </div>
                  <div className="chart" aria-hidden="true">
                    {CHART.map((c, ci) => (
                      <div key={ci} className="col" style={{ animationDelay: `${(0.03 * ci).toFixed(2)}s` }}>
                        {Array.from({ length: c.total }, (_, k) => (
                          <i key={k} className={k < c.user ? 'u' : undefined} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sites">
                  <div className="head">
                    <span>{h.sites.cols.site}</span>
                    <span>{h.sites.cols.crawl}</span>
                    <span>{h.sites.cols.user}</span>
                  </div>
                  {SITES.map(([name, crawl, user]) => (
                    <div key={name}>
                      <span>{name}</span>
                      <span>{crawl}</span>
                      <span>{user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="wrap section">
          <div className="oss">
            <div className="oss-card">
              <p className="mono-label kicker">[ {t.oss.label} ]</p>
              <h2>{t.oss.title}</h2>
              <p className="oss-lede">{t.oss.lede}</p>
              <ul>
                {t.oss.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="term">
              <div className="mono-label">{t.oss.install}</div>
              <pre>
                <b>$</b> npm i payload-plugin-geo @garus-ltd/geo-next{'\n'}
                <span># {t.oss.or}</span>{'\n'}
                <b>$</b> npm i strapi-plugin-geo @garus-ltd/geo-next<span className="blink">▌</span>
              </pre>
              <a className="pill" href={site.repo}>{t.oss.docs}</a>
            </div>
          </div>
        </section>

        <section className="wrap section">
          <p className="mono-label kicker">[ {t.faq.label} ]</p>
          <div className="faq">
            {t.faq.items.map((f) => (
              <div key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap cta">
          <div className="cta-box">
            <div className="layer dots" />
            <div className="cta-in">
              <h2 className="dotfont">
                {t.cta.titleLines[0]}
                <br />
                {t.cta.titleLines[1]}
              </h2>
              <WaitlistForm source="footer" lang={lang} t={t.form} onRed />
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap foot mono-label">
        <span>© {new Date().getFullYear()} {site.shortName}</span>
        <a href={site.repo}>{site.repo.replace('https://', '')}</a>
      </footer>
    </>
  )
}

function CardHead({ n, title, body, preview }: { n: string; title: string; body: string; preview?: string }) {
  return (
    <div className="card-head">
      <div>
        <p className="card-num">{n}</p>
        <h3>{title}</h3>
        <p className="card-body">{body}</p>
      </div>
      {preview && <span className="tag-preview mono-label">{preview}</span>}
    </div>
  )
}
