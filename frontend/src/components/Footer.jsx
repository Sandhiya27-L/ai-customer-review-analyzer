import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-white">ReviewAI</h3>
          <p className="mt-3 text-sm">AI-powered customer review analysis for smarter business decisions.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Product</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white">Get Started</Link></li>
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Connect</h4>
          <div className="mt-3 flex gap-3">
            <a href="mailto:support@reviewai.com" className="rounded-lg bg-slate-800 p-2 hover:bg-primary-600"><FiMail /></a>
            <a href="#" className="rounded-lg bg-slate-800 p-2 hover:bg-primary-600"><FiTwitter /></a>
            <a href="#" className="rounded-lg bg-slate-800 p-2 hover:bg-primary-600"><FiLinkedin /></a>
            <a href="#" className="rounded-lg bg-slate-800 p-2 hover:bg-primary-600"><FiGithub /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm">
        © {new Date().getFullYear()} ReviewAI. All rights reserved.
      </div>
    </footer>
  );
}
