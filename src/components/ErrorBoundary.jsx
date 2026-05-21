import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import AuroraBackground from './AuroraBackground'
import Logo from './Logo'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Aurora render error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <AuroraBackground />
        <div className="glass-strong w-full max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
            <AlertTriangle size={22} />
          </div>
          <Logo size={32} withWordmark={false} />
          <h1 className="mt-5 text-xl font-semibold tracking-tight text-zinc-50">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            The page crashed instead of rendering. Refreshing usually restores
            the workspace.
          </p>
          <pre className="mt-4 max-h-32 overflow-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-[11px] text-zinc-400">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-aurora mt-5 w-full"
          >
            <RefreshCw size={14} />
            Refresh app
          </button>
        </div>
      </div>
    )
  }
}
