import { cn } from '../lib/cn';
import type { Filter } from '../types';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Done' },
];

type TodoToolbarProps = {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  remaining: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export default function TodoToolbar({
  filter,
  onFilterChange,
  remaining,
  completedCount,
  onClearCompleted,
}: TodoToolbarProps) {
  return (
    <div className="mt-5 border-t border-white/8 pt-3.5">
      <div className="flex gap-2" role="tablist" aria-label="Filter todos">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={cn(
              'flex-1 rounded-full px-2.5 py-2 transition',
              filter === item.id
                ? 'bg-linear-to-b from-[#ffd27a] to-[var(--accent)] font-bold text-[#2a140e]'
                : 'bg-white/5 text-[var(--muted)] hover:bg-white/8'
            )}
            onClick={() => onFilterChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <p className="m-0">
          {remaining === 0 ? 'Nothing left to do' : `${remaining} remaining`}
        </p>
        {completedCount > 0 && (
          <button
            type="button"
            className="border-0 bg-transparent font-semibold text-[var(--accent-2)] hover:underline"
            onClick={onClearCompleted}
          >
            Clear done
          </button>
        )}
      </div>
    </div>
  );
}
