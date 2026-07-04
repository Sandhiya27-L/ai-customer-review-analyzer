import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { historyApi } from '../api/services';

export default function Compare() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([null, null]);

  useEffect(() => {
    historyApi.list({}).then(({ data }) => setItems(data)).catch(() => setItems([]));
  }, []);

  const handleSelect = (index, id) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = items.find((item) => item.id === Number(id)) || null;
      return next;
    });
  };

  return (
    <DashboardLayout title="Review Comparison">
      <div className="glass-card mb-6 p-6">
        <p className="text-sm text-slate-500">Select two analyses from your history to compare side by side.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[0, 1].map((index) => (
            <select
              key={index}
              className="input-field"
              value={selected[index]?.id || ''}
              onChange={(e) => handleSelect(index, e.target.value)}
            >
              <option value="">Select analysis {index + 1}</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.summary?.slice(0, 60)}...
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {selected[0] && selected[1] ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {selected.map((analysis, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="font-bold">Analysis {index + 1}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{analysis.summary}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Positive:</strong> {analysis.sentiment.positive}%</p>
                <p><strong>Neutral:</strong> {analysis.sentiment.neutral}%</p>
                <p><strong>Negative:</strong> {analysis.sentiment.negative}%</p>
                <p><strong>Words:</strong> {analysis.wordCount}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-green-600">Top Positive</h4>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {(analysis.positivePoints || []).slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-red-600">Top Negative</h4>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {(analysis.negativePoints || []).slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500">
          Select two analyses above to compare them
        </div>
      )}
    </DashboardLayout>
  );
}
