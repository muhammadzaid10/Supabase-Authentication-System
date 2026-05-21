import { useState, useRef, useEffect } from 'react'
import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Topbar({ onOpenMobileSidebar, title }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0]
  const initials = name?.slice(0, 2)?.toUpperCase() ?? '??'

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-4 lg:px-8">
      <button
        onClick={onOpenMobileSidebar}
        aria-label="Open menu"
        className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100 lg:hidden"
      >
        <Menu size={16} />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <h1 className="hidden text-sm font-medium text-zinc-300 md:block">
          {title}
        </h1>

        <div className="ml-auto flex w-full max-w-xs items-center">
          <div className="group relative w-full">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search…"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2 pl-9 pr-12 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-aurora-blue/40 focus:outline-none focus:ring-2 focus:ring-aurora-blue/10"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <ThemeToggle />

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute right-0 top-12 w-80 overflow-hidden rounded-2xl shadow-soft"
            >
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-zinc-500">You're all caught up</p>
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {[
                  { t: 'Welcome to Aurora', d: 'Your account is ready.', ago: 'just now' },
                  { t: 'Security check', d: 'New sign-in from this device.', ago: '2m' },
                  { t: 'Tip', d: 'Enable two-factor for added safety.', ago: '1h' },
                ].map((n, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-grad-aurora" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-100">{n.t}</p>
                      <p className="truncate text-xs text-zinc-500">{n.d}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-zinc-500">{n.ago}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile dropdown */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-1 pl-1 pr-2.5 transition-colors hover:bg-white/[0.05]"
        >
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-grad-aurora text-[10px] font-semibold text-white ring-1 ring-white/10">
              {initials}
            </div>
          )}
          <ChevronDown size={14} className="text-zinc-500" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute right-0 top-12 w-60 overflow-hidden rounded-2xl shadow-soft"
            >
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-zinc-500">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <MenuItem to="/profile" icon={User} label="Profile" onClick={() => setMenuOpen(false)} />
                <MenuItem to="/settings" icon={Settings} label="Settings" onClick={() => setMenuOpen(false)} />
              </div>
              <div className="border-t border-white/[0.06] p-1.5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-300 transition-colors hover:bg-rose-500/[0.08]"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function MenuItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-zinc-100"
    >
      <Icon size={14} />
      {label}
    </Link>
  )
}
