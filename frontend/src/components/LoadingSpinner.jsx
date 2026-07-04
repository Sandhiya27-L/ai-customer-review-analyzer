export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-primary-200 border-t-primary-600 dark:border-slate-700 dark:border-t-primary-400 ${sizes[size]}`}
      />
    </div>
  );
}
