// Example data for the page's illustrations. Nothing here is real traffic.

export type Kind = 'user' | 'search' | 'training' | 'spoofed'

export const LOG_POOL: { agent: string; kind: Kind; path: string; fake?: boolean }[] = [
  { agent: 'ChatGPT-User', kind: 'user', path: '/blog/headless-cms-pricing' },
  { agent: 'PerplexityBot', kind: 'search', path: '/docs/getting-started' },
  { agent: 'Claude-User', kind: 'user', path: '/blog/payload-vs-strapi' },
  { agent: 'GPTBot', kind: 'training', path: '/pricing' },
  { agent: 'OAI-SearchBot', kind: 'search', path: '/blog/llms-txt-explained' },
  { agent: 'GPTBot', kind: 'spoofed', path: '/wp-login.php', fake: true },
  { agent: 'ClaudeBot', kind: 'training', path: '/blog/payload-vs-strapi' },
  { agent: 'Perplexity-User', kind: 'user', path: '/changelog' },
  { agent: 'Claude-SearchBot', kind: 'search', path: '/docs/json-ld' },
  { agent: 'CCBot', kind: 'training', path: '/about' },
  { agent: 'ChatGPT-User', kind: 'user', path: '/blog/ai-crawler-logs' },
]

export const MARQUEE = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot',
  'Perplexity-User', 'KimiBot', 'Kimi-SearchBot', 'Kimi-User', 'YandexAdditional', 'Google-Agent', 'Google-GeminiNotebook',
  'Meta-ExternalAgent', 'Applebot', 'Bytespider', 'MistralAI-User', 'CCBot',
]

// [crawler, pages fetched out of 40]. Only crawlers geo-core recognises.
/** Per AI platform, last 30 days: [vendor, all crawler visits, live user fetches]. Mirrors the plugin's byPlatform stats. */
export const ENGINES: [string, number, number][] = [
  ['OpenAI', 4120, 1180],
  ['Anthropic', 2260, 410],
  ['Perplexity', 3050, 640],
  ['Moonshot', 980, 75],
  ['Yandex', 0, 0],
]
export const ENGINE_DOTS = 30
export const ENGINES_TOTAL = ENGINES.reduce((n, e) => n + e[1], 0)

export const SITES: [string, string, string][] = [
  ['acme.com', '38.2k', '6.1k'],
  ['docs.acme.com', '21.7k', '4.4k'],
  ['client-shop.de', '9.8k', '702'],
  ['blog.client.io', '3.1k', '96'],
]

export const CHART = Array.from({ length: 30 }, (_, c) => {
  const total = 3 + Math.round(5 + 4 * Math.sin(c / 3.2) + c / 6)
  const user = Math.max(1, Math.round(total * (0.18 + 0.12 * Math.sin(c / 5 + 1))))
  return { total, user }
})

export const REFERRALS: [string, number][] = [
  ['ChatGPT', 62],
  ['Perplexity', 21],
  ['Claude', 9],
  ['Gemini', 5],
  ['Doubao', 3],
]

export const DIAGNOSTICS: [string, 'robots' | 'js' | 'never' | 'jsonld' | 'ok'][] = [
  ['/pricing', 'robots'],
  ['/compare', 'js'],
  ['/blog/2024-roadmap', 'never'],
  ['/docs/install', 'jsonld'],
  ['/blog/payload-vs-strapi', 'ok'],
]

// rank in the answer's cited sources, or null when the site was not cited
export const CITATIONS: number[] = [2, 1, 0, 0, 4, 3]
