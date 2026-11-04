// Example data for the page's illustrations. Nothing here is real.

/** Per site, last 30 days: [site, AI crawler reads, answers citing it]. */
export const SITES: [string, string, string][] = [
  ['acme.com', '38.2k', '18'],
  ['docs.acme.com', '21.7k', '11'],
  ['client-shop.de', '9.8k', '4'],
  ['blog.client.io', '3.1k', '0'],
]

export const CHART = Array.from({ length: 30 }, (_, c) => {
  const total = 3 + Math.round(5 + 4 * Math.sin(c / 3.2) + c / 6)
  const user = Math.max(1, Math.round(total * (0.18 + 0.12 * Math.sin(c / 5 + 1))))
  return { total, user }
})

// Rank among the answer's cited sources per assistant (same order as soon.citations.names); 0 = not cited.
export const CITATIONS: number[] = [3, 0, 0, 2, 1, 4]

/** Per page, last 30 days: [path, AI crawler reads, answers citing it out of GAP_OF]. */
export const GAP: [string, number, number][] = [
  ['/pricing', 412, 0],
  ['/docs/install', 238, 0],
  ['/blog/payload-vs-strapi', 190, 4],
  ['/compare', 96, 1],
]
export const GAP_OF = 6
