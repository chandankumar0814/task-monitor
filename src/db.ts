import Dexie, { type EntityTable } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  date: string; // ISO format
  time: string; // HH:mm format
  completed: boolean;
  createdAt: number;
}

const db = new Dexie('TaskFlowDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

db.version(1).stores({
  tasks: '++id, title, date, completed'
});

export { db };
