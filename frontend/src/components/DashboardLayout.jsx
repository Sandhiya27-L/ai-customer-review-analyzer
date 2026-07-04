import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiColumns,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSettings,
  FiStar,
  FiSun,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/analyze', label: 'Analyze Reviews', icon: FiSearch },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/favorites', label: 'Favorites', icon: FiStar },
  { to: '/compare', label: 'Compare', icon: FiColumns },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/60 p-4 dark:border-slate-700/60">
        <Link to="/dashboard" className="text-lg font-bold text-primary-600">
          ReviewAI
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="hidden rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:block"
        >
          <FiChevronLeft />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200/60 p-3 dark:border-slate-700/60">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <FiLogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200/60 bg-white/90 backdrop-blur-xl transition-transform dark:border-slate-700/60 dark:bg-slate-900/90 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarOpen ? 'lg:w-72' : 'lg:w-0 lg:overflow-hidden lg:border-0'}`}
      >
        {sidebarContent}
      </aside>

      <div className={`transition-all ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth >= 1024) setSidebarOpen((prev) => !prev);
                  else setMobileOpen(true);
                }}
                className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileOpen ? <FiX /> : <FiMenu />}
              </button>
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="hidden rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:block"
                >
                  <FiChevronRight />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-sm text-slate-500">Welcome back, {user?.fullName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
