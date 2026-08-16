import { useEffect, useMemo, useState } from 'react';
import type { Priority, Todo } from '../types';

const STORAGE_KEY = 'todoapp.todos';

function normalizeTodo(value: unknown): Todo | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Partial<Todo>;
  if (typeof item.id !== 'string' || typeof item.text !== 'string') return null;

  return {
    id: item.id,
    text: item.text,
    completed: Boolean(item.completed),
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    priority:
      item.priority === 'low' || item.priority === 'high' ? item.priority : 'medium',
  };
}

function readStoredTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTodo).filter((todo): todo is Todo => todo !== null);
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(readStoredTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority = 'medium') => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    setTodos((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
        priority,
      },
    ]);
    return true;
  };

  const updateTodo = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      remaining: todos.length - completed,
    };
  }, [todos]);

  return {
    todos,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
}
