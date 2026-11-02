import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Doto, Geist, Geist_Mono } from 'next/font/google'
import { site } from '../../site.config'
import { dictionaries, hasLocale, locales } from '../../i18n'
import './globals.css'

const dot = Doto({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-dot' })
const sans = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-mono' })

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const t = dictionaries[lang]
  return {
    metadataBase: new URL(site.url),
    title: `${site.name} | ${t.meta.title}`,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { title: site.name, description: t.meta.description, type: 'website', locale: lang },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return (
    <html lang={lang} className={`${dot.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{'.reveal .col,.reveal .notif,.reveal .cell{animation:none}'}</style>
        </noscript>
        {children}
      </body>
    </html>
  )
}
