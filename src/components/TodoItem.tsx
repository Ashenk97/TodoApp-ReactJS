import { useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';
import type { Todo } from '../types';

const PRIORITY_DOT: Record<Todo['priority'], string> = {
  low: 'bg-sky-300',
  medium: 'bg-[var(--accent-2)]',
  high: 'bg-rose-400',
};

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (todo: Todo) => void;
  style?: CSSProperties;
};

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
  style,
}: TodoItemProps) {
  const [draft, setDraft] = useState(todo.text);

  useEffect(() => {
    setDraft(todo.text);
  }, [todo.text]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(todo.text);
      return;
    }
    if (trimmed !== todo.text) {
      onUpdate(todo.id, trimmed);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur();
    if (event.key === 'Escape') {
      setDraft(todo.text);
      event.currentTarget.blur();
    }
  };

  return (
    <li
      style={style}
      className={cn(
        'todo-item grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/6 bg-[#0b1020]/38 px-3 py-2.5',
        todo.completed && 'opacity-70'
      )}
    >
      <label className="relative size-[22px]">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark ${todo.text} as ${todo.completed ? 'active' : 'complete'}`}
          className="peer absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
        />
        <span className="block size-[22px] rounded-full border-2 border-white/35 transition peer-checked:scale-105 peer-checked:border-[var(--done)] peer-checked:bg-[var(--done)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent-2)]" />
        <span className="pointer-events-none absolute top-[4px] left-[7px] h-2.5 w-1.5 rotate-45 scale-0 border-r-2 border-b-2 border-[#123] transition peer-checked:scale-100" />
      </label>
      <div className="min-w-0">
        <input
          className={cn(
            'w-full border-0 bg-transparent text-base outline-none',
            todo.completed && 'text-[var(--muted)] line-through'
          )}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          aria-label={`Edit ${todo.text}`}
        />
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--muted)] capitalize">
          <span className={cn('size-1.5 rounded-full', PRIORITY_DOT[todo.priority])} />
          {todo.priority} priority
        </p>
      </div>
      <button
        type="button"
        className="grid size-9 place-items-center rounded-xl text-[var(--muted)] transition hover:bg-rose-400/12 hover:text-[var(--danger)] hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-2)]"
        onClick={() => onDelete(todo)}
        aria-label={`Delete ${todo.text}`}
      >
        <Trash2 className="size-[18px]" />
      </button>
    </li>
  );
}
