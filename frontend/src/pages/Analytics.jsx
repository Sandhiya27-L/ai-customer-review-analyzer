import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import DashboardLayout from '../components/DashboardLayout';
import SkeletonLoader from '../components/SkeletonLoader';
import StatCard from '../components/StatCard';
import { FiBarChart2, FiHash, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { historyApi } from '../api/services';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Analytics() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await historyApi.list({});
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    if (!items.length) {
      return {
        totalReviews: 0,
        avgLength: 0,
        topKeyword: '—',
        sentiment: { positive: 0, neutral: 0, negative: 0 },
        keywordCounts: {},
      };
    }

    const keywordCounts = {};
    items.forEach((item) => {
      (item.keywords || []).forEach((kw) => {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
      });
    });

    const topKeyword = Object.entries(keywordCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return {
      totalReviews: items.length,
      avgLength: Math.round(items.reduce((s, i) => s + i.wordCount, 0) / items.length),
      topKeyword,
      sentiment: {
        positive: Math.round(items.reduce((s, i) => s + i.sentiment.positive, 0) / items.length),
        neutral: Math.round(items.reduce((s, i) => s + i.sentiment.neutral, 0) / items.length),
        negative: Math.round(items.reduce((s, i) => s + i.sentiment.negative, 0) / items.length),
      },
      keywordCounts,
    };
  }, [items]);

  const pieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [stats.sentiment.positive, stats.sentiment.neutral, stats.sentiment.negative],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const topKeywords = Object.entries(stats.keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const barData = {
    labels: topKeywords.map(([k]) => k),
    datasets: [{
      label: 'Mentions',
      data: topKeywords.map(([, v]) => v),
      backgroundColor: '#6366f1',
      borderRadius: 8,
    }],
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)
        ) : (
          <>
            <StatCard title="Total Reviews" value={stats.totalReviews} icon={FiMessageSquare} gradient="from-blue-500 to-cyan-500" />
            <StatCard title="Avg Review Length" value={`${stats.avgLength} words`} icon={FiBarChart2} gradient="from-purple-500 to-pink-500" />
            <StatCard title="Top Keyword" value={stats.topKeyword} icon={FiHash} gradient="from-orange-500 to-red-500" />
            <StatCard title="Avg Positive" value={`${stats.sentiment.positive}%`} icon={FiTrendingUp} gradient="from-green-500 to-emerald-500" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-bold">Sentiment Distribution</h3>
          {loading ? (
            <SkeletonLoader className="h-64" />
          ) : items.length === 0 ? (
            <p className="text-slate-500">No data available</p>
          ) : (
            <div className="mx-auto max-w-sm">
              <Pie data={pieData} />
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-bold">Top Keywords</h3>
          {loading ? (
            <SkeletonLoader className="h-64" />
          ) : topKeywords.length === 0 ? (
            <p className="text-slate-500">No keywords found</p>
          ) : (
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
