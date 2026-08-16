import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Backdrop from './components/Backdrop';
import ConfirmDialog from './components/ConfirmDialog';
import ProgressRing from './components/ProgressRing';
import StatCard from './components/StatCard';
import ToastStack from './components/ToastStack';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoToolbar from './components/TodoToolbar';
import { useToasts } from './hooks/useToasts';
import { useTodos } from './hooks/useTodos';
import type { Filter, Priority, Todo } from './types';

export default function App() {
  const {
    todos,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  } = useTodos();
  const { toasts, pushToast, dismissToast } = useToasts();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Todo | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  const visibleTodos = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return todos.filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      return needle === '' || todo.text.toLowerCase().includes(needle);
    });
  }, [todos, filter, query]);

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  useEffect(() => {
    document.title =
      stats.remaining > 0 ? `${stats.remaining} remaining · Today` : 'Today · Todo';
  }, [stats.remaining]);

  const progress = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
  const allDone = stats.total > 0 && stats.remaining === 0;

  const handleAdd = (text: string, priority: Priority) => {
    const added = addTodo(text, priority);
    if (added) {
      if (filter === 'completed') setFilter('all');
      pushToast('Task added');
    }
    return added;
  };

  const handleToggle = (id: string) => {
    const todo = todos.find((item) => item.id === id);
    toggleTodo(id);
    if (todo && !todo.completed) pushToast('Marked complete');
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden px-4 py-8">
      <Backdrop />

      <main className="relative z-10 mx-auto w-full max-w-[520px] rounded-[22px] border border-white/14 bg-linear-to-b from-white/12 to-white/8 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.38)] backdrop-blur-[22px] animate-[rise_0.7s_ease]">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-[0.92rem] font-semibold text-[var(--accent-2)]">{today}</p>
            <h1 className="m-0 text-[clamp(2.2rem,6vw,3rem)] tracking-tight">Today</h1>
          </div>
          <ProgressRing value={progress} />
        </header>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Open" value={stats.remaining} />
          <StatCard label="Done" value={stats.completed} />
        </div>

        <label className="mb-4 flex items-center gap-2 rounded-2xl bg-[#0b1020]/45 px-3 py-2.5">
          <Search className="size-4 shrink-0 text-[var(--muted)]" />
          <span className="sr-only">Search todos</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks"
            className="w-full border-0 bg-transparent outline-none placeholder:text-[#8d86a3]"
          />
        </label>

        <TodoForm onAdd={handleAdd} />

        {allDone && (
          <p
            className="mt-3.5 rounded-xl bg-linear-to-r from-[#7cf0b2] to-[#ffe08a] px-3 py-2.5 text-center font-semibold text-[#103322] animate-[pop_0.45s_ease]"
            role="status"
          >
            All done — nice work.
          </p>
        )}

        <TodoList
          todos={visibleTodos}
          filter={filter}
          hasQuery={query.trim().length > 0}
          onToggle={handleToggle}
          onUpdate={updateTodo}
          onDelete={setPendingDelete}
        />

        {stats.total > 0 && (
          <TodoToolbar
            filter={filter}
            onFilterChange={setFilter}
            remaining={stats.remaining}
            completedCount={stats.completed}
            onClearCompleted={() => setClearOpen(true)}
          />
        )}
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Are you sure?"
        description={
          pendingDelete
            ? `“${pendingDelete.text}” will be removed from your list. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteTodo(pendingDelete.id);
          setPendingDelete(null);
          pushToast('Task deleted');
        }}
      />

      <ConfirmDialog
        open={clearOpen}
        title="Are you sure?"
        description={`Clear ${stats.completed} completed ${stats.completed === 1 ? 'task' : 'tasks'}? This cannot be undone.`}
        confirmLabel="Clear done"
        onCancel={() => setClearOpen(false)}
        onConfirm={() => {
          clearCompleted();
          setClearOpen(false);
          pushToast('Completed tasks cleared');
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
