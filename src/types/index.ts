export type Priority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'completed';

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
};

export type Toast = {
  id: string;
  message: string;
};
