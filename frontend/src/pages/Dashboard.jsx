import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiFileText, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { historyApi, profileApi } from '../api/services';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, recentRes] = await Promise.all([
          profileApi.get(),
          historyApi.recent(5),
        ]);
        setProfile(profileRes.data);
        setRecent(recentRes.data);
      } catch {
        setProfile(null);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgSentiment = recent.length
    ? Math.round(recent.reduce((sum, r) => sum + (r.sentiment?.positive || 0), 0) / recent.length)
    : 0;

  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: recent.length
        ? [
            Math.round(recent.reduce((s, r) => s + r.sentiment.positive, 0) / recent.length),
            Math.round(recent.reduce((s, r) => s + r.sentiment.neutral, 0) / recent.length),
            Math.round(recent.reduce((s, r) => s + r.sentiment.negative, 0) / recent.length),
          ]
        : [34, 33, 33],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderWidth: 0,
    }],
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)
        ) : (
          <>
            <StatCard title="Total Analyses" value={profile?.totalAnalyses ?? 0} icon={FiFileText} gradient="from-blue-500 to-cyan-500" />
            <StatCard title="Avg Positive %" value={`${avgSentiment}%`} icon={FiTrendingUp} gradient="from-green-500 to-emerald-500" />
            <StatCard title="Recent Reviews" value={recent.length} icon={FiActivity} gradient="from-purple-500 to-pink-500" />
            <StatCard title="Member Since" value={profile?.joinedDate ? new Date(profile.joinedDate).getFullYear() : '—'} icon={FiBarChart2} gradient="from-orange-500 to-red-500" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/analyze" className="btn-primary w-full"><FiSearch /> Analyze Reviews</Link>
            <Link to="/history" className="btn-secondary w-full"><FiFileText /> View History</Link>
            <Link to="/analytics" className="btn-secondary w-full"><FiBarChart2 /> View Analytics</Link>
            <Link to="/compare" className="btn-secondary w-full">Compare Reviews</Link>
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="mb-4 text-lg font-bold">Sentiment Overview</h3>
          <div className="mx-auto max-w-[200px]">
            <Doughnut data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="mb-4 text-lg font-bold">Recent Activity</h3>
          {loading ? (
            <SkeletonLoader className="h-40" />
          ) : recent.length === 0 ? (
            <p className="text-sm text-slate-500">No analyses yet. Start by analyzing reviews!</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((item) => (
                <li key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
                  <p className="font-medium line-clamp-1">{item.summary}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()} · +{item.sentiment.positive}%
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 glass-card p-6">
        <h3 className="mb-4 text-lg font-bold">Recent Analyses</h3>
        {loading ? (
          <SkeletonLoader className="h-48" />
        ) : recent.length === 0 ? (
          <p className="text-slate-500">Your recent analyses will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 pr-4">Summary</th>
                  <th className="pb-3 pr-4">Words</th>
                  <th className="pb-3 pr-4">Sentiment</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 max-w-xs truncate">{item.summary}</td>
                    <td className="py-3 pr-4">{item.wordCount}</td>
                    <td className="py-3 pr-4">
                      <span className="text-green-600">+{item.sentiment.positive}%</span>
                      {' / '}
                      <span className="text-red-600">-{item.sentiment.negative}%</span>
                    </td>
                    <td className="py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
