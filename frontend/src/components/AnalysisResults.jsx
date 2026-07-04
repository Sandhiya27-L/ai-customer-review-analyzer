import { FiCopy, FiDownload, FiFileText, FiSave, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { copyAnalysisToClipboard, exportToCsv, exportToJson, exportToPdf } from '../utils/exportUtils';
import { favoritesApi, historyApi } from '../api/services';

export default function AnalysisResults({ analysis, onSaved, showSave = true }) {
  if (!analysis) return null;

  const handleSave = async () => {
    try {
      const { data } = await historyApi.save(analysis);
      toast.success('Analysis saved to history');
      onSaved?.(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save analysis');
    }
  };

  const handleFavorite = async () => {
    if (!analysis.id) {
      toast.error('Save the analysis first before adding to favorites');
      return;
    }
    try {
      await favoritesApi.add(analysis.id);
      toast.success('Added to favorites');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add favorite');
    }
  };

  const handleCopy = async () => {
    await copyAnalysisToClipboard(analysis);
    toast.success('Copied to clipboard');
  };

  const sections = [
    { title: 'Positive Points', items: analysis.positivePoints, color: 'text-green-600' },
    { title: 'Negative Points', items: analysis.negativePoints, color: 'text-red-600' },
    { title: 'Common Complaints', items: analysis.complaints, color: 'text-orange-600' },
    { title: 'Appreciated Features', items: analysis.features, color: 'text-blue-600' },
    { title: 'Keywords', items: analysis.keywords, color: 'text-purple-600' },
    { title: 'Suggestions', items: analysis.suggestions, color: 'text-indigo-600' },
  ];

  return (
    <div className="animate-slide-up space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold">Overall Summary</h3>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{analysis.summary}</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="mb-4 text-xl font-bold">Sentiment Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Positive', value: analysis.sentiment?.positive || 0, color: 'bg-green-500' },
            { label: 'Neutral', value: analysis.sentiment?.neutral || 0, color: 'bg-yellow-500' },
            { label: 'Negative', value: analysis.sentiment?.negative || 0, color: 'bg-red-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className={`h-full rounded-full transition-all ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="glass-card p-6">
            <h4 className={`mb-3 font-bold ${section.color}`}>{section.title}</h4>
            <ul className="space-y-2">
              {(section.items || []).map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-primary-600">{index + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {showSave && (
          <button type="button" onClick={handleSave} className="btn-primary">
            <FiSave /> Save Analysis
          </button>
        )}
        <button type="button" onClick={handleCopy} className="btn-secondary">
          <FiCopy /> Copy
        </button>
        <button type="button" onClick={() => exportToPdf(analysis)} className="btn-secondary">
          <FiDownload /> Download PDF
        </button>
        <button type="button" onClick={() => exportToJson(analysis)} className="btn-secondary">
          <FiFileText /> Export JSON
        </button>
        <button type="button" onClick={() => exportToCsv(analysis)} className="btn-secondary">
          <FiFileText /> Export CSV
        </button>
        {analysis.id && (
          <button type="button" onClick={handleFavorite} className="btn-secondary">
            <FiStar /> Add to Favorites
          </button>
        )}
      </div>
    </div>
  );
}
