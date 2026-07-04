import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import SkeletonLoader from '../components/SkeletonLoader';
import { favoritesApi } from '../api/services';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await favoritesApi.list();
      setItems(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (favoriteId) => {
    try {
      await favoritesApi.remove(favoriteId);
      setItems((prev) => prev.filter((item) => item.favoriteId !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove favorite');
    }
  };

  return (
    <DashboardLayout title="Favorites">
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FiStar className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No favorites yet. Save analyses to see them here.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.favoriteId || item.id} className="glass-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-500 fill-yellow-500" />
                    <h3 className="font-semibold line-clamp-2">{item.summary}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.wordCount} words · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex gap-3 text-sm">
                    <span className="text-green-600">+{item.sentiment.positive}%</span>
                    <span className="text-red-600">-{item.sentiment.negative}%</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.favoriteId)}
                  className="btn-secondary text-sm text-red-600"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
