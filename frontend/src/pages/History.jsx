import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiDownload, FiRefreshCw, FiSearch, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { historyApi } from '../api/services';
import { addSearchHistory, getSearchHistory } from '../utils/helpers';
import { exportToJson, exportToPdf } from '../utils/exportUtils';

export default function History() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState(getSearchHistory());
  const navigate = useNavigate();

  const loadHistory = async (searchTerm = search) => {
    setLoading(true);
    try {
      const { data } = await historyApi.list({ search: searchTerm || undefined });
      setItems(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    addSearchHistory(search);
    setSearchHistory(getSearchHistory());
    loadHistory(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return;
    try {
      await historyApi.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Analysis deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleReAnalyze = (item) => {
    navigate('/analyze', { state: { reviewText: item.reviewText } });
  };

  return (
    <DashboardLayout title="History">
      <div className="glass-card p-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>

        {searchHistory.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-slate-500">Recent searches:</span>
            {searchHistory.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => { setSearch(term); loadHistory(term); }}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">No analyses found</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="glass-card p-6 transition hover:shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold line-clamp-2">{item.summary}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.wordCount} words · {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-2 flex gap-3 text-sm">
                    <span className="text-green-600">+{item.sentiment.positive}%</span>
                    <span className="text-yellow-600">~{item.sentiment.neutral}%</span>
                    <span className="text-red-600">-{item.sentiment.negative}%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => handleReAnalyze(item)} className="btn-secondary text-sm">
                    <FiRefreshCw /> Re-analyze
                  </button>
                  <button type="button" onClick={() => exportToPdf(item)} className="btn-secondary text-sm">
                    <FiDownload /> PDF
                  </button>
                  <button type="button" onClick={() => exportToJson(item)} className="btn-secondary text-sm">
                    JSON
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
