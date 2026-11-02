import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { site } from '../../site.config'
import { dictionaries, hasLocale, locales } from '../../i18n'
import './globals.css'

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
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
