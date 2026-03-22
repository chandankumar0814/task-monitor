import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Calendar, Clock, ChevronRight, Check } from 'lucide-react';
import { format, isToday, isFuture, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';
import { useTaskStore } from './store';

const App = () => {
  const { tasks, loading, fetchTasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use a ref to store tasks for the reminder logic to avoid effect loops
  const tasksRef = useRef<any[]>([]);
  tasksRef.current = tasks;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reminder Logic
  useEffect(() => {
    // Request notification permissions
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const notifiedTasks = new Set<string>();

    const interval = setInterval(async () => {
      const now = new Date();
      const currentTimeString = format(now, 'HH:mm');

      tasksRef.current.forEach(async (task) => {
        const taskKey = `${task.id}-${currentTimeString}`;
        
        if (!task.completed && task.time === currentTimeString && !notifiedTasks.has(taskKey)) {
          notifiedTasks.add(taskKey);

          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification('TaskFlow Reminder', {
              body: `Time for: ${task.task || task.title}`,
              icon: '/favicon.svg',
              vibrate: [200, 100, 200],
              tag: taskKey,
              badge: '/favicon.svg'
            });
          } else {
            alert(`⏰ ALARM: ${task.title} (${task.time})`);
          }
        }
      });

      if (now.getMinutes() === 0) notifiedTasks.clear();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showAddSheet) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAddSheet]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, date, time);
    setTitle('');
    setShowAddSheet(false);
  };

  const onToggle = (id: number, completed: boolean) => {
    if (!completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ffffff']
      });
    }
    toggleTask(id);
  };

  const todayTasks = tasks.filter(t => isToday(parseISO(t.date)) && !t.completed);
  const upcomingTasks = tasks.filter(t => isFuture(parseISO(t.date)) && !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  const completionRate = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto relative overflow-hidden">
      {/* Header & Progress */}
      <header className="p-8 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold gradient-text">TaskFlow</h1>
            <p className="text-white/50">{format(new Date(), 'EEEE, do MMMM')}</p>
          </div>
          <div className="text-right">
             <span className="text-2xl font-bold text-primary-blue">{Math.round(completionRate)}%</span>
             <p className="text-xs text-white/40 uppercase tracking-widest">Progress</p>
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary-blue to-primary-purple"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
          />
        </div>
      </header>

      {/* Sections */}
      <main className="px-6 space-y-8">
        <TaskSection title="Today" tasks={todayTasks} onToggle={onToggle} onDelete={deleteTask} />
        <TaskSection title="Upcoming" tasks={upcomingTasks} onToggle={onToggle} onDelete={deleteTask} />
        <TaskSection title="Completed" tasks={completedTasks} onToggle={onToggle} onDelete={deleteTask} />
      </main>

      {/* FAB */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl btn-gradient shadow-lg shadow-primary-blue/20 flex items-center justify-center z-40"
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddSheet(true)}
      >
        <Plus size={32} />
      </motion.button>

      {/* Add Task Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowAddSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 glass rounded-t-3xl p-8 z-50 max-w-md mx-auto"
            >
              <form onSubmit={handleAddTask} className="space-y-6">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="What's next?"
                  className="w-full bg-transparent text-2xl font-medium outline-none placeholder:text-white/20"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <div className="flex gap-4">
                  <div className="flex-1 glass rounded-xl p-3 flex items-center gap-3">
                    <Calendar size={18} className="text-primary-blue" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-transparent text-sm outline-none w-full"
                    />
                  </div>
                  <div className="flex-1 glass rounded-xl p-3 flex items-center gap-3">
                    <Clock size={18} className="text-primary-purple" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-transparent text-sm outline-none w-full"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 btn-gradient rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Task
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskSection = ({ title, tasks, onToggle, onDelete }: { title: string, tasks: any[], onToggle: any, onDelete: any }) => (
  <div className="space-y-4">
    <h2 className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">{title}</h2>
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map(task => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) onToggle(task.id, task.completed);
              if (info.offset.x < -80) onDelete(task.id);
            }}
            className="group relative"
          >
            <div className="absolute inset-0 flex items-center justify-between px-6 rounded-2xl">
              <CheckCircle2 className="text-green-500 opacity-50" />
              <Trash2 className="text-red-500 opacity-50" />
            </div>

            <div className="relative glass p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]">
              <button 
                onClick={() => onToggle(task.id, task.completed)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-green-500 border-green-500' : 'border-white/10'
                }`}
              >
                {task.completed && <Check size={14} className="text-black font-bold" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${task.completed ? 'text-white/30 line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30 uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {format(parseISO(task.date), 'MMM d')}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {task.time}</span>
                </div>
              </div>
              
              <ChevronRight size={16} className="text-white/10 group-hover:text-white/30 transition-colors" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {tasks.length === 0 && (
        <p className="text-sm text-white/10 italic py-2 ml-1">No tasks here</p>
      )}
    </div>
  </div>
);

export default App;
