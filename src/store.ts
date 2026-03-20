import { create } from 'zustand';
import { db, type Task } from './db';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, date: string, time: string) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: true,
  fetchTasks: async () => {
    const tasks = await db.tasks.toArray();
    set({ tasks, loading: false });
  },
  addTask: async (title, date, time) => {
    const newTask: Task = {
      title,
      date,
      time,
      completed: false,
      createdAt: Date.now(),
    };
    await db.tasks.add(newTask);
    await get().fetchTasks();
  },
  toggleTask: async (id) => {
    const task = await db.tasks.get(id);
    if (task) {
      await db.tasks.update(id, { completed: !task.completed });
      await get().fetchTasks();
    }
  },
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    await get().fetchTasks();
  },
}));
