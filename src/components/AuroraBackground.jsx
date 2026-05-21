/**
 * The signature visual: a fixed-position layer with three blurred aurora
 * blobs and a faint grid overlay. Used behind public pages and the
 * dashboard alike.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <span className="aurora-blob cyan animate-aurora-1" />
      <span className="aurora-blob violet animate-aurora-2" />
      <span className="aurora-blob blue animate-aurora-3" />
    </div>
  )
}
