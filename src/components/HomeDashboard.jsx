import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Pin, Plus, CheckSquare, Calendar, BookOpen, Clock, 
  Smile, Mic, MapPin, Tag, ArrowUpRight, CheckCircle2, Circle, AlertCircle, Edit3, Trash2
} from 'lucide-react';

export default function HomeDashboard({ 
  user, 
  memories, 
  tasks, 
  calendarEvents, 
  onSelectMemory, 
  onNewNote,
  onToggleTask,
  onAddTask,
  onNavigateView
}) {
  const [scratchpad, setScratchpad] = useState('');
  const [isSavingScratchpad, setIsSavingScratchpad] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickMood, setQuickMood] = useState('😊 Joy');
  const [inlineTask, setInlineTask] = useState('');

  // Fetch Scratchpad content from backend
  useEffect(() => {
    fetch('/api/scratchpad')
      .then(res => res.json())
      .then(data => {
        if (data.content !== undefined) setScratchpad(data.content);
      })
      .catch(err => console.error('Scratchpad fetch error:', err));
  }, []);

  // Debounced auto-save scratchpad
  const handleScratchpadChange = (e) => {
    const val = e.target.value;
    setScratchpad(val);
    setIsSavingScratchpad(true);

    const timer = setTimeout(() => {
      fetch('/api/scratchpad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: val })
      })
        .then(() => setIsSavingScratchpad(false))
        .catch(err => {
          console.error(err);
          setIsSavingScratchpad(false);
        });
    }, 1000);

    return () => clearTimeout(timer);
  };

  // Quick Memory Capture form submit
  const handleQuickCapture = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quickTitle,
        content_html: `<p>${quickContent}</p>`,
        content_text: quickContent,
        mood: quickMood,
        is_pinned: 0,
        tags: '#quick-note'
      })
    })
      .then(res => res.json())
      .then(data => {
        setQuickTitle('');
        setQuickContent('');
        if (data.memory) onSelectMemory(data.memory);
      })
      .catch(err => console.error(err));
  };

  const handleQuickAddTask = (e) => {
    e.preventDefault();
    if (!inlineTask.trim()) return;
    onAddTask(inlineTask);
    setInlineTask('');
  };

  const pinnedMemories = memories.filter(m => m.is_pinned && !m.is_trash);
  const recentMemories = memories.filter(m => !m.is_trash).slice(0, 4);
  const upcomingTasks = tasks.filter(t => !t.is_completed).slice(0, 5);

  const moods = ['😊 Joy', '💡 Insight', '🚀 Growth', '🌿 Calm', '🎨 Creative'];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Greeting Banner */}
      <div className="relative rounded-3xl p-8 glass-panel border border-slate-800 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Evernote Home Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Good day, {user?.name?.split(' ')[0] || 'Alex'} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Here is what’s happening in your second brain today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={onNewNote}
              className="px-5 py-3 text-xs font-bold text-white emerald-gradient rounded-2xl hover:opacity-95 transition-all shadow-lg emerald-glow flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Quick Capture & Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Capture Card */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Memory Note</h2>
            </div>
            <div className="flex items-center space-x-1">
              {moods.map(m => (
                <button 
                  key={m} 
                  onClick={() => setQuickMood(m)}
                  className={`text-xs px-2 py-1 rounded-lg transition-all ${quickMood === m ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {m.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleQuickCapture} className="space-y-3">
            <input 
              type="text" 
              placeholder="Title of this memory or thought..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
            />
            <textarea 
              placeholder="What's on your mind? Capture quick notes, ideas, or journal reflections..."
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">{quickMood}</span>
                <span>Auto-tagged #quick-note</span>
              </div>
              <button 
                type="submit"
                disabled={!quickTitle.trim()}
                className="px-4 py-2 text-xs font-bold text-white emerald-gradient rounded-xl disabled:opacity-50 transition-all flex items-center space-x-1.5 shadow-md"
              >
                <span>Save to Notes</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Scratchpad Card */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Scratchpad</h2>
            </div>
            <span className="text-[10px] text-slate-400">
              {isSavingScratchpad ? 'Saving...' : 'Auto-saved'}
            </span>
          </div>
          <textarea 
            value={scratchpad}
            onChange={handleScratchpadChange}
            placeholder="Use this scratchpad for temporary notes, phone numbers, or quick drafts..."
            className="w-full flex-1 min-h-[140px] bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-amber-200/90 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 resize-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Grid Row 2: Recent Notes & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Memories List */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Memories & Notes</h2>
            </div>
            <button 
              onClick={() => onNavigateView('notes')}
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>View all ({memories.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentMemories.map(mem => (
              <div 
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {mem.notebook_name || 'General'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">{mem.mood}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {mem.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {mem.content_text || 'No preview text...'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-4 pt-2 border-t border-slate-900">
                  <span>{new Date(mem.created_at).toLocaleDateString()}</span>
                  <span className="text-slate-400 font-mono">{mem.tags || ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Tasks Widget */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">My Tasks</h2>
              </div>
              <button 
                onClick={() => onNavigateView('tasks')}
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                All Tasks
              </button>
            </div>

            {/* Inline Task Adder */}
            <form onSubmit={handleQuickAddTask} className="mb-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a new task..."
                  value={inlineTask}
                  onChange={(e) => setInlineTask(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  disabled={!inlineTask.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs disabled:opacity-50 shrink-0"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {upcomingTasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => onToggleTask(t.id, !t.is_completed)}
                  className="flex items-start space-x-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <button className="mt-0.5 text-slate-500 hover:text-emerald-400">
                    {t.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1 truncate">
                    <p className={`text-xs font-medium ${t.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {t.title}
                    </p>
                    {t.due_date && (
                      <span className="text-[10px] text-amber-400 font-mono">Due {t.due_date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
