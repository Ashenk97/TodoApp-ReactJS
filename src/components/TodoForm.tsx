import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../lib/cn';
import type { Priority } from '../types';

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Med' },
  { id: 'high', label: 'High' },
];

type TodoFormProps = {
  onAdd: (text: string, priority: Priority) => boolean;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onAdd(text, priority)) {
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="new-todo">
          New todo
        </label>
        <input
          id="new-todo"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
          maxLength={120}
          className="min-w-0 flex-1 rounded-2xl border border-transparent bg-[#0b1020]/50 px-4 py-3 outline-none transition placeholder:text-[#8d86a3] focus:border-[var(--accent)]/70 focus:shadow-[0_0_0_3px_rgba(255,122,89,0.18)]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-b from-[#ffd27a] to-[var(--accent)] px-4 font-bold text-[#2a140e] transition enabled:hover:-translate-y-px enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Priority">
        <span className="text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
          Priority
        </span>
        {PRIORITIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPriority(item.id)}
            className={cn(
              'rounded-full px-3 py-1 text-sm transition',
              priority === item.id
                ? item.id === 'high'
                  ? 'bg-rose-400 text-[#2a140e] font-semibold'
                  : item.id === 'low'
                    ? 'bg-sky-300 text-[#102033] font-semibold'
                    : 'bg-[var(--accent-2)] text-[#2a140e] font-semibold'
                : 'bg-white/6 text-[var(--muted)] hover:bg-white/10'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </form>
  );
}
