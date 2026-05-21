/**
 * Custom mark — an "A" formed by two intersecting gradient triangles.
 * Avoids generic SaaS logo templates.
 */
export default function Logo({ size = 32, withWordmark = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="aurora-mark" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          fill="url(#aurora-mark)"
          fillOpacity="0.15"
          stroke="url(#aurora-mark)"
          strokeOpacity="0.4"
        />
        <path
          d="M12 28 L20 11 L28 28 M15.5 22 H24.5"
          stroke="url(#aurora-mark)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {withWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Aurora
        </span>
      )}
    </div>
  )
}
