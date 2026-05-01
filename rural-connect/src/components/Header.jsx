import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/search', label: t('nav.search') },
    { path: '/post-job', label: t('nav.postJob') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/dashboard', label: t('nav.dashboard') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="app-shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            RC
          </div>
          <span className="text-lg font-semibold text-slate-900">Rural Connect</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === item.path
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          {!user ? (
            <>
              <Link to="/login" className="btn-secondary hidden sm:inline-flex">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user.name}</span>
              <button className="btn-secondary" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header

