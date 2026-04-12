const DOTS = [
  { cx: 40, cy: 40, r: 4 },
  { cx: 120, cy: 20, r: 6 },
  { cx: 200, cy: 60, r: 3 },
  { cx: 80, cy: 100, r: 5 },
  { cx: 160, cy: 130, r: 4 },
  { cx: 260, cy: 30, r: 5 },
  { cx: 300, cy: 110, r: 3 },
  { cx: 20, cy: 160, r: 6 },
]

export default function FloatingDots({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#6C47FF" fillOpacity="0.18" />
      ))}
    </svg>
  )
}
