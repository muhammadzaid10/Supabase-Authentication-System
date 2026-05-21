import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  Settings,
  Shield,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/security', label: 'Security', icon: Shield },
]

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onMobileClose }) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }

  const width = collapsed ? 76 : 256

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 hidden h-screen flex-col p-3 lg:flex`}
      >
        <SidebarInner
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          user={user}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col p-3 lg:hidden"
          >
            <SidebarInner
              collapsed={false}
              setCollapsed={() => {}}
              user={user}
              onLogout={handleLogout}
              onLinkClick={onMobileClose}
              hideCollapseBtn
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarInner({
  collapsed,
  setCollapsed,
  user,
  onLogout,
  onLinkClick,
  hideCollapseBtn,
}) {
  return (
    <div className="glass-strong flex h-full flex-col rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-4">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <Logo size={26} withWordmark />
        </motion.div>
        {collapsed && <Logo size={26} withWordmark={false} />}
        {!hideCollapseBtn && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200 lg:inline-flex"
          >
            {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          </button>
        )}
      </div>

      <div className="mx-3 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {NAV.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            collapsed={collapsed}
            onClick={onLinkClick}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-2 p-2">
        <div className="mx-2 h-px bg-white/[0.06]" />
        <UserChip user={user} collapsed={collapsed} />
        <button
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-rose-500/[0.08] hover:text-rose-300"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )
}

function NavItem({ to, label, icon: Icon, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'text-white'
            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="active-nav"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-aurora-cyan/[0.12] via-aurora-blue/[0.12] to-aurora-violet/[0.12] ring-1 ring-inset ring-white/10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Icon size={16} className="relative z-10 shrink-0" />
          {!collapsed && <span className="relative z-10">{label}</span>}
          {isActive && !collapsed && (
            <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          )}
        </>
      )}
    </NavLink>
  )
}

function UserChip({ user, collapsed }) {
  if (!user) return null
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0]
  const initials = name?.slice(0, 2)?.toUpperCase() ?? '??'

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <Avatar initials={initials} src={user.user_metadata?.avatar_url} />
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">{name}</p>
          <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
        </div>
      )}
    </div>
  )
}

function Avatar({ initials, src }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/10"
      />
    )
  }
  return (
    <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-grad-aurora text-[11px] font-semibold text-white ring-1 ring-white/10">
      {initials}
    </div>
  )
}
