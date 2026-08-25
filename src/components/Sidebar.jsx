import React, { useState } from 'react';
import { 
  Home, FileText, BookOpen, CheckSquare, Calendar, Layout, Trash2, Settings, 
  Plus, Search, ChevronDown, Sparkles, LogOut, ChevronRight, Hash, Heart
} from 'lucide-react';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  notebooks, 
  selectedNotebook, 
  setSelectedNotebook,
  onNewNote,
  onNewNotebook,
  onOpenSearch,
  user,
  onLogout,
  onBackToLanding
}) {
  const [isNotebooksOpen, setIsNotebooksOpen] = useState(true);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, count: null },
    { id: 'notes', label: 'Memories / Notes', icon: FileText, count: null },
    { id: 'notebooks', label: 'Notebooks', icon: BookOpen, count: notebooks.length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: null },
    { id: 'calendar', label: 'Calendar', icon: Calendar, count: null },
    { id: 'templates', label: 'Templates', icon: Layout, count: null },
    { id: 'trash', label: 'Trash', icon: Trash2, count: null },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none">
      {/* Top Section */}
      <div className="p-4 space-y-4">
        {/* Brand & Account Menu */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onBackToLanding}>
            <div className="w-8 h-8 rounded-lg emerald-gradient flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-none">Memories</h1>
              <span className="text-[10px] text-emerald-400 font-medium">Evernote Engine</span>
            </div>
          </div>
          <button 
            onClick={onBackToLanding}
            title="Landing Page"
            className="text-xs text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded transition-colors"
          >
            Web
          </button>
        </div>

        {/* Global Search Trigger */}
        <button 
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 transition-all group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span>Search memories...</span>
          </div>
          <kbd className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">⌘K</kbd>
        </button>

        {/* Quick New Note Button */}
        <div className="relative">
          <button 
            onClick={onNewNote}
            className="w-full py-2.5 px-4 text-xs font-bold text-white emerald-gradient rounded-xl hover:opacity-95 transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Memory Note</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id && !selectedNotebook;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedNotebook(null);
                  setCurrentView(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Notebooks Sub-Tree */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-3 py-1 mb-1">
            <button 
              onClick={() => setIsNotebooksOpen(!isNotebooksOpen)}
              className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white"
            >
              <ChevronDown className={`w-3 h-3 transition-transform ${isNotebooksOpen ? '' : '-rotate-90'}`} />
              <span>Notebooks</span>
            </button>
            <button 
              onClick={onNewNotebook}
              title="Create Notebook"
              className="text-slate-400 hover:text-emerald-400 p-0.5 rounded hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isNotebooksOpen && (
            <div className="space-y-0.5 pl-2 max-h-40 overflow-y-auto">
              {notebooks.map(nb => (
                <button
                  key={nb.id}
                  onClick={() => {
                    setSelectedNotebook(nb);
                    setCurrentView('notes');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    selectedNotebook?.id === nb.id 
                      ? 'bg-slate-800 text-white font-semibold' 
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: nb.color || '#14A053' }} 
                    />
                    <span className="truncate">{nb.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{nb.note_count || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Account Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-emerald-500/40 object-cover"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Alex Vance'}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user?.plan || 'Evernote Personal'}</p>
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('settings')}
            title="Settings"
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
