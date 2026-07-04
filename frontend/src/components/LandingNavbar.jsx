import { Link } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function LandingNavbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
          ReviewAI
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium hover:text-primary-600">Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary-600">How It Works</a>
          <a href="#benefits" className="text-sm font-medium hover:text-primary-600">Benefits</a>
          <a href="#faq" className="text-sm font-medium hover:text-primary-600">FAQ</a>
          <a href="#contact" className="text-sm font-medium hover:text-primary-600">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleDarkMode} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <Link to="/login" className="btn-secondary hidden sm:inline-flex">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
