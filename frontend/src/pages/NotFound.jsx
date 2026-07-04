import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4 dark:from-slate-950 dark:to-indigo-950">
      <h1 className="text-8xl font-extrabold text-primary-600">404</h1>
      <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">Page not found</p>
      <Link to="/" className="btn-primary mt-8">
        <FiHome /> Go Home
      </Link>
    </div>
  );
}
