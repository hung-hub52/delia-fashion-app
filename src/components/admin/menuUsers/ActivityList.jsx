// src/components/admin/menuUsers/ActivityList.jsx

export default function ActivityList({ activities = [] }) {
  if (!activities.length)
    return (
      <div className="text-center text-gray-400">Chưa có hoạt động nào.</div>
    );
  return (
    <div className="max-h-40 overflow-y-auto space-y-2">
      {activities.map((act, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm bg-violet-50 dark:bg-violet-900/50 px-3 py-2 rounded-lg"
        >
          <span className="text-pink-500 dark:text-pink-300 font-bold">•</span>
          <span className="flex-1">{act.action}</span>
          <span className="text-xs text-gray-400">{act.time}</span>
        </div>
      ))}
    </div>
  );
}
