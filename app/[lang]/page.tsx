import { notFound } from 'next/navigation'
import { site } from '../../site.config'
import { dictionaries, hasLocale, locales } from '../../i18n'
import { CHART, DIAGNOSTICS, ENGINES, ENGINE_PAGES, MARQUEE, REFERRALS, SITES } from './demo'
import { LiveConsole } from './LiveConsole'
import { Reveal } from './Reveal'
import { WaitlistForm } from './WaitlistForm'

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = dictionaries[lang]
  const h = t.soon
  const f = t.free

  return (
    <>
      <header className="topbar">
        <div className="wrap top">
          <a href={`/${lang}`} className="logo">
            {site.shortName.toUpperCase()}
            <span className="rdot" aria-hidden="true" />
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

        <div className="wrap">
          <LiveConsole t={t.console} />
        </div>

        <section className="marquee" aria-label={t.marqueeLabel}>
          <div className="marq marquee-track">
            {[...MARQUEE, ...MARQUEE].map((b, i) => (
              <span key={i} aria-hidden={i >= MARQUEE.length ? true : undefined}>
                {b}
                <i className="rdot" />
              </span>
            ))}
          </div>
        </section>

        <section className="wrap section">
          <p className="mono-label kicker">[ {t.purposes.label} ]</p>
          <div className="purposes">
            {t.purposes.items.map((p, i) => (
              <div key={p.word} className={i === 2 ? 'pcard dark' : 'pcard'}>
                <div className="word dotfont">{p.word}</div>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap section">
          <div className="sec-head">
            <h2 className="dotfont">
              {f.titleLines[0]}
              <br />
              {f.titleLines[1]}
            </h2>
            <p>{f.lede}</p>
          </div>

          <div className="cards">
            {/* 01 in the CMS */}
            <Reveal className="card wide soft cms">
              <div className="cms-copy">
                <p className="card-num">01</p>
                <h3>{f.cms.title}</h3>
                <p className="card-body">{f.cms.body}</p>
              </div>
              <div className="cms-mock">
                <div className="cms-editor">
                  <div className="mono-label" style={{ fontSize: 11, color: 'var(--muted)' }}>{f.cms.crumb}</div>
                  <div className="t">{f.cms.post}</div>
                  <div className="cms-lines" aria-hidden="true">
                    <i style={{ width: '100%' }} />
                    <i style={{ width: '92%' }} />
                    <i style={{ width: '97%' }} />
                    <i style={{ width: '64%' }} />
                  </div>
                </div>
                <div className="cms-panel">
                  <div className="mono-label" style={{ fontSize: 11, color: 'var(--dark-muted)' }}>{f.cms.panel}</div>
                  <div className="big">1,180</div>
                  <div className="u">{f.cms.unit}</div>
                  <ul>
                    {f.cms.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
            {/* 02 referrals */}
            <Reveal className="card">
              <CardHead n="02" title={f.referrals.title} body={f.referrals.body} />
              <div className="refs bottom">
                {REFERRALS.map(([name, pct], ri) => {
                  const on = Math.max(1, Math.round(pct / 5))
                  return (
                    <div key={name}>
                      <div className="ref-top"><span>{name}</span><span>{pct}%</span></div>
                      <div className="cells" aria-hidden="true">
                        {Array.from({ length: 20 }, (_, q) => (
                          <i
                            key={q}
                            className={q < on ? `on cell${ri === 0 ? ' first' : ''}` : undefined}
                            style={q < on ? { animationDelay: `${(0.4 + ri * 0.15 + q * 0.04).toFixed(2)}s` } : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            <div className="oss-card">
              <p className="mono-label kicker">[ {t.oss.label} ]</p>
              <h2>{t.oss.title}</h2>
              <ul>
                {t.oss.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="term wide">
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
          <div className="sec-head">
            <h2 className="dotfont">
              {h.titleLines[0]}
              <br />
              {h.titleLines[1]}
            </h2>
            <p>{h.lede}</p>
          </div>

          <div className="cards">
            {/* 03 which AI has indexed you */}
            <Reveal className="card wide">
              <CardHead n="03" title={h.indexed.title} body={h.indexed.body} preview={h.tag} />
              <div className="idx" role="table" aria-label={h.indexed.title}>
                <div className="idx-row head" role="row">
                  <span role="columnheader">{h.indexed.cols.engine}</span>
                  <span role="columnheader">{h.indexed.cols.pages}</span>
                  <span role="columnheader" style={{ textAlign: 'right' }}>{h.indexed.cols.cover}</span>
                  <span role="columnheader" className="idx-seen">{h.indexed.cols.seen}</span>
                </div>
                {ENGINES.map(([owner, fetched], ei) => {
                  const pct = Math.round((fetched / ENGINE_PAGES) * 100)
                  return (
                    <div key={owner} className="idx-row" role="row">
                      <span role="cell">
                        {h.indexed.names[ei]}
                        <small>{owner}</small>
                      </span>
                      <span className="idx-dots" role="cell" aria-label={`${fetched} / ${ENGINE_PAGES}`}>
                        {Array.from({ length: ENGINE_PAGES }, (_, q) => (
                          <i
                            key={q}
                            className={q < fetched ? 'on cell' : undefined}
                            style={q < fetched ? { animationDelay: `${(0.2 + ei * 0.12 + q * 0.018).toFixed(2)}s` } : undefined}
                          />
                        ))}
                      </span>
                      <span role="cell" className={pct < 30 ? 'idx-pct low' : 'idx-pct'}>{pct}%</span>
                      <span role="cell" className="idx-seen">{h.indexed.seen[ei]}</span>
                    </div>
                  )
                })}
              </div>
              <p className="fine">{h.indexed.note}</p>
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

            {/* 05 alerts */}
            <Reveal className="card">
              <CardHead n="05" title={h.alerts.title} body={h.alerts.body} preview={h.tag} />
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

            {/* 06 scheduled checks */}
            <Reveal className="card">
              <CardHead n="06" title={h.diagnostics.title} body={h.diagnostics.body} preview={h.tag} />
              <div className="diag bottom">
                {DIAGNOSTICS.map(([path, tag]) => (
                  <div key={path}>
                    <span className="p">{path}</span>
                    <span className={`chip ${tag === 'robots' ? 'red' : tag === 'js' ? 'ink' : tag === 'ok' ? 'ok' : ''}`}>
                      {h.diagnostics.tags[tag]}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

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
