/** Askbeam mark: a red source dot and a dot-matrix beam fanning out from it. */
export const BEAM: [number, number][] = [
  [11, 12],
  [16, 8], [16, 12], [16, 16],
  [21, 4], [21, 8], [21, 12], [21, 16], [21, 20],
]

export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="4" cy="12" r="3.2" fill="var(--red, #c8161d)" />
      {BEAM.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="currentColor" />
      ))}
    </svg>
  )
}
