import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import AuroraBackground from '../components/AuroraBackground'

const TITLES = {
  '/dashboard': 'Overview',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/security': 'Security',
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] || 'Overview'
  // Drive the content offset via a CSS variable so it responds to window
  // resizes without needing a JS listener.
  const sidebarWidth = collapsed ? '76px' : '256px'

  return (
    <div
      className="relative min-h-screen"
      style={{ '--sidebar-w': sidebarWidth }}
    >
      <AuroraBackground />
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className="min-h-screen transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:pl-[var(--sidebar-w)]"
      >
        <Topbar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={title}
        />

        <main className="px-4 pb-12 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
