import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCheck, FiCpu, FiShield, FiStar, FiUpload, FiZap } from 'react-icons/fi';
import Footer from '../components/Footer';
import LandingNavbar from '../components/LandingNavbar';

const features = [
  { icon: FiCpu, title: 'AI-Powered Analysis', desc: 'Leverage Google Gemini to extract deep insights from customer reviews instantly.' },
  { icon: FiBarChart2, title: 'Visual Analytics', desc: 'Interactive charts showing sentiment trends, keywords, and review patterns.' },
  { icon: FiUpload, title: 'Flexible Input', desc: 'Paste reviews, upload TXT or CSV files for batch analysis.' },
  { icon: FiShield, title: 'Secure & Private', desc: 'JWT authentication and encrypted passwords keep your data safe.' },
];

const steps = [
  { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds.' },
  { step: '2', title: 'Upload Reviews', desc: 'Paste text or upload TXT/CSV files.' },
  { step: '3', title: 'AI Analysis', desc: 'Gemini AI processes and analyzes sentiment.' },
  { step: '4', title: 'Get Insights', desc: 'View reports, export PDFs, and track history.' },
];

const benefits = [
  'Save hours of manual review reading',
  'Identify recurring complaints quickly',
  'Discover features customers love most',
  'Make data-driven product decisions',
  'Export professional PDF reports',
  'Track analysis history over time',
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Manager', text: 'ReviewAI transformed how we process customer feedback. We cut analysis time by 80%.' },
  { name: 'Marcus Johnson', role: 'E-commerce Owner', text: 'The sentiment charts helped us pinpoint exactly what needed fixing in our product.' },
  { name: 'Emily Rodriguez', role: 'Customer Success Lead', text: 'Exporting PDF reports for stakeholders has never been easier. Highly recommended!' },
];

const faqs = [
  { q: 'What AI model does ReviewAI use?', a: 'We use Google Gemini 2.5 Flash for fast, accurate review analysis.' },
  { q: 'Is my data secure?', a: 'Yes. All passwords are BCrypt encrypted and API access uses JWT tokens.' },
  { q: 'Can I export my analyses?', a: 'Absolutely. Export to PDF, JSON, or CSV formats anytime.' },
  { q: 'What file formats are supported?', a: 'You can paste text directly or upload .txt and .csv files.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <LandingNavbar />

      <section className="relative overflow-hidden px-4 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            <FiZap /> Powered by Google Gemini AI
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Analyze Customer Reviews
            <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              With AI Intelligence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Transform raw customer feedback into actionable insights. Sentiment analysis, keyword extraction, and professional reports — all in one platform.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg">Get Started <FiArrowRight /></Link>
            <Link to="/login" className="btn-secondary text-lg">Login</Link>
            <Link to="/register" className="btn-secondary text-lg">Analyze Reviews</Link>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold">Powerful Features</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-400">
            Everything you need to understand your customers better.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 p-3 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white/50 px-4 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-2xl font-bold text-white shadow-lg">
                  {step}
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">Why Choose ReviewAI?</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Stop drowning in customer feedback. Let AI do the heavy lifting while you focus on what matters — improving your product.
            </p>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    <FiCheck className="h-4 w-4" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                <span>Positive Sentiment</span>
                <span className="font-bold text-green-600">68%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <span>Neutral Sentiment</span>
                <span className="font-bold text-yellow-600">18%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                <span>Negative Sentiment</span>
                <span className="font-bold text-red-600">14%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/50 px-4 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-4xl font-bold">What Our Users Say</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="glass-card p-6">
                <div className="mb-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-300">&ldquo;{text}&rdquo;</p>
                <div className="mt-4">
                  <p className="font-bold">{name}</p>
                  <p className="text-sm text-slate-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-4xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-12 space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="glass-card group p-6">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-4xl font-bold">Get In Touch</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Have questions? We&apos;d love to hear from you.</p>
          <a href="mailto:support@reviewai.com" className="btn-primary mt-8">Contact Us</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
