import React, { useState } from 'react';
import { CheckSquare, Plus, Circle, CheckCircle2, Trash2, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TasksView({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [filter, setFilter] = useState('all');
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(taskTitle, dueDate, priority);
    setTaskTitle('');
    setDueDate('');
  };

  const handleToggleWithConfetti = (id, newStatus) => {
    if (newStatus) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
    onToggleTask(id, newStatus);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    if (filter === 'high') return t.priority === 'High';
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Tasks & Action Items</h1>
          <p className="text-xs text-slate-400 mt-1">Track your to-dos, priorities, and deadlines across notes.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'pending', 'completed', 'high'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Form */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Add a new actionable task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
          />
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-amber-400 font-semibold focus:outline-none"
          >
            <option value="High">Priority: High 🔥</option>
            <option value="Medium">Priority: Medium ⚡</option>
            <option value="Low">Priority: Low 🍃</option>
          </select>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
          />
          <button 
            type="submit"
            disabled={!taskTitle.trim()}
            className="px-5 py-2.5 emerald-gradient text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 shrink-0 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 shadow-xl">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No tasks found in this view category.
          </div>
        ) : (
          filteredTasks.map(t => (
            <div 
              key={t.id}
              className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center space-x-3 truncate">
                <button 
                  onClick={() => handleToggleWithConfetti(t.id, !t.is_completed)}
                  className="text-slate-500 hover:text-emerald-400 shrink-0"
                >
                  {t.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                  )}
                </button>
                <div className="truncate">
                  <p className={`text-sm font-semibold truncate ${t.is_completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {t.title}
                  </p>
                  {t.memory_title && (
                    <p className="text-[10px] text-slate-500 truncate">Linked to: {t.memory_title}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  t.priority === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  t.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {t.priority}
                </span>

                {t.due_date && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {t.due_date}
                  </span>
                )}

                <button 
                  onClick={() => onDeleteTask(t.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
