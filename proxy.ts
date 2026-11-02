import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, hasLocale, locales, type Locale } from './i18n'

// Pick the best supported language from Accept-Language (by q value).
function pickLocale(header: string | null): Locale {
  if (!header) return defaultLocale
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { base: tag.toLowerCase().split('-')[0], q: q ? Number(q.split('=')[1]) || 0 : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { base } of ranked) if (hasLocale(base)) return base
  return defaultLocale
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return
  const url = req.nextUrl.clone()
  url.pathname = `/${pickLocale(req.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
