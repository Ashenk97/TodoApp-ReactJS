import type { CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import TodoItem from './TodoItem';
import type { Filter, Todo } from '../types';

const EMPTY_COPY: Record<Filter | 'search', { title: string; detail: string }> = {
  all: {
    title: 'Nothing here yet',
    detail: 'Add a task and it will land in this list.',
  },
  active: {
    title: 'All caught up',
    detail: 'No open tasks. Enjoy the quiet, or add another.',
  },
  completed: {
    title: 'No completed tasks',
    detail: 'Finish something and it will show up here.',
  },
  search: {
    title: 'No matches',
    detail: 'Try a different search, or clear the query.',
  },
};

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  hasQuery: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (todo: Todo) => void;
};

export default function TodoList({
  todos,
  filter,
  hasQuery,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    const copy = EMPTY_COPY[hasQuery ? 'search' : filter];
    return (
      <div className="mt-8 text-center text-[var(--muted)]" role="status">
        <span className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-linear-to-br from-white to-[var(--accent)] text-[#2a140e] shadow-[0_0_24px_rgba(255,122,89,0.45)] animate-[pulse_2.4s_ease-in-out_infinite]">
          <Sparkles className="size-6" />
        </span>
        <p className="m-0 font-semibold text-[var(--text)]">{copy.title}</p>
        <p className="mt-1.5 mb-2">{copy.detail}</p>
      </div>
    );
  }

  return (
    <ul className="mt-5 grid list-none gap-2.5 p-0">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          style={{ '--stagger': `${index * 40}ms` } as CSSProperties}
        />
      ))}
    </ul>
  );
}
