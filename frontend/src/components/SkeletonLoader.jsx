export default function SkeletonLoader({ className = 'h-24' }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />
  );
}
