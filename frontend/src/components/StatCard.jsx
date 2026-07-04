export default function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className="glass-card group p-6 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br p-3 text-white shadow-lg ${gradient}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
