import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import AnalysisResults from '../components/AnalysisResults';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { reviewApi } from '../api/services';
import { countChars, countWords, addRecentSearch } from '../utils/helpers';
import { parseCsvFile, parseTxtFile } from '../utils/exportUtils';

export default function Analyze() {
  const location = useLocation();
  const [reviewText, setReviewText] = useState(location.state?.reviewText || '');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const txtRef = useRef(null);
  const csvRef = useRef(null);

  useEffect(() => {
    if (location.state?.reviewText) {
      setReviewText(location.state.reviewText);
    }
  }, [location.state]);

  const handleAnalyze = async () => {
    if (reviewText.trim().length < 10) {
      toast.error('Please enter at least 10 characters of review text');
      return;
    }

    setLoading(true);
    try {
      const { data } = await reviewApi.analyze(reviewText);
      setAnalysis(data);
      addRecentSearch(reviewText.slice(0, 50));
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReviewText('');
    setAnalysis(null);
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    try {
      const content = type === 'txt' ? await parseTxtFile(file) : await parseCsvFile(file);
      setReviewText(content);
      toast.success(`${type.toUpperCase()} file loaded`);
    } catch {
      toast.error('Failed to read file');
    }
  };

  return (
    <DashboardLayout title="Analyze Reviews">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold">Customer Reviews</h2>
          <p className="mt-1 text-sm text-slate-500">Paste reviews or upload a file for AI analysis</p>

          <textarea
            className="input-field mt-4 min-h-[300px] resize-y font-mono text-sm"
            placeholder="Paste customer reviews here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <div className="mt-2 flex justify-between text-sm text-slate-500">
            <span>{countChars(reviewText)} characters</span>
            <span>{countWords(reviewText)} words</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <input ref={txtRef} type="file" accept=".txt" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'txt')} />
            <input ref={csvRef} type="file" accept=".csv" hidden onChange={(e) => handleFileUpload(e.target.files[0], 'csv')} />
            <button type="button" onClick={() => txtRef.current?.click()} className="btn-secondary">
              <FiUpload /> Upload TXT
            </button>
            <button type="button" onClick={() => csvRef.current?.click()} className="btn-secondary">
              <FiUpload /> Upload CSV
            </button>
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={handleAnalyze} disabled={loading} className="btn-primary flex-1">
              {loading ? <LoadingSpinner size="sm" /> : 'Analyze'}
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              <FiTrash2 /> Clear
            </button>
          </div>
        </div>

        <div>
          {loading && (
            <div className="glass-card flex flex-col items-center justify-center p-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-slate-500">Analyzing reviews with Gemini AI...</p>
            </div>
          )}
          {!loading && analysis && (
            <AnalysisResults analysis={analysis} onSaved={(saved) => setAnalysis(saved)} />
          )}
          {!loading && !analysis && (
            <div className="glass-card flex h-full min-h-[400px] items-center justify-center p-12 text-center text-slate-500">
              Enter reviews and click Analyze to see AI-powered insights
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
