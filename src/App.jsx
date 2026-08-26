import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import HomeDashboard from './components/HomeDashboard';
import NoteEditor from './components/NoteEditor';
import NotebooksView from './components/NotebooksView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import TemplatesModal from './components/TemplatesModal';
import SearchModal from './components/SearchModal';
import TrashView from './components/TrashView';
import SettingsView from './components/SettingsView';
import AuthModal from './components/AuthModal';

export default function App() {
  const [viewMode, setViewMode] = useState('landing');
  const [currentView, setCurrentView] = useState('home');

  // Data States
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  // Selection states
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [activeMemory, setActiveMemory] = useState(null);

  // Search & Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Helper fetch with Auth header
  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem('memories_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    return fetch(url, { ...options, headers });
  };

  // Check auth & fetch initial data
  const fetchData = () => {
    const savedToken = localStorage.getItem('memories_token');

    authFetch(`${API_BASE}/api/auth/me`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          if (savedToken) setViewMode('app');
        }
      })
      .catch(err => console.error(err));

    authFetch(`${API_BASE}/api/memories`)
      .then(res => res.json())
      .then(data => { if (data.memories) setMemories(data.memories); })
      .catch(err => console.error(err));

    authFetch(`${API_BASE}/api/notebooks`)
      .then(res => res.json())
      .then(data => { if (data.notebooks) setNotebooks(data.notebooks); })
      .catch(err => console.error(err));

    authFetch(`${API_BASE}/api/tasks`)
      .then(res => res.json())
      .then(data => { if (data.tasks) setTasks(data.tasks); })
      .catch(err => console.error(err));

    authFetch(`${API_BASE}/api/calendar`)
      .then(res => res.json())
      .then(data => { if (data.events) setCalendarEvents(data.events); })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAuthOrApp = () => {
    if (user && localStorage.getItem('memories_token')) {
      setViewMode('app');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('memories_token');
    setUser(null);
    setViewMode('landing');
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setViewMode('app');
    fetchData();
  };

  // Keyboard shortcut Ctrl+K for search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handlers for Memories / Notes
  const handleSaveMemory = (payload) => {
    if (payload.id) {
      authFetch(`${API_BASE}/api/memories/${payload.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.memory) {
            setMemories(prev => prev.map(m => m.id === data.memory.id ? data.memory : m));
            setActiveMemory(data.memory);
          }
        });
    } else {
      authFetch(`${API_BASE}/api/memories`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          if (data.memory) {
            setMemories(prev => [data.memory, ...prev]);
            setActiveMemory(data.memory);
          }
        });
    }
  };

  const handleDeleteMemory = (id) => {
    authFetch(`${API_BASE}/api/memories/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, is_trash: 1 } : m));
        setActiveMemory(null);
      });
  };

  const handleRestoreMemory = (id) => {
    authFetch(`${API_BASE}/api/memories/${id}/restore`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setMemories(prev => prev.map(m => m.id === id ? { ...m, is_trash: 0 } : m));
      });
  };

  const handlePermanentDelete = (id) => {
    authFetch(`${API_BASE}/api/memories/${id}?permanent=true`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setMemories(prev => prev.filter(m => m.id !== id));
      });
  };

  // Notebooks Handlers
  const handleCreateNotebook = (data) => {
    authFetch(`${API_BASE}/api/notebooks`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.notebook) {
          setNotebooks(prev => [...prev, resData.notebook]);
        }
      });
  };

  const handleDeleteNotebook = (id) => {
    authFetch(`${API_BASE}/api/notebooks/${id}`, { method: 'DELETE' })
      .then(() => {
        setNotebooks(prev => prev.filter(n => n.id !== id));
        if (selectedNotebook?.id === id) setSelectedNotebook(null);
      });
  };

  // Tasks Handlers
  const handleAddTask = (title, due_date = null, priority = 'Medium') => {
    authFetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, due_date, priority })
    })
      .then(res => res.json())
      .then(data => {
        if (data.task) setTasks(prev => [data.task, ...prev]);
      });
  };

  const handleToggleTask = (id, is_completed) => {
    authFetch(`${API_BASE}/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_completed: is_completed ? 1 : 0 })
    })
      .then(res => res.json())
      .then(data => {
        if (data.task) {
          setTasks(prev => prev.map(t => t.id === id ? data.task : t));
        }
      });
  };

  const handleDeleteTask = (id) => {
    authFetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(prev => prev.filter(t => t.id !== id)));
  };

  // Calendar Handlers
  const handleAddEvent = (data) => {
    authFetch(`${API_BASE}/api/calendar`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.event) setCalendarEvents(prev => [...prev, resData.event]);
      });
  };

  const handleDeleteEvent = (id) => {
    authFetch(`${API_BASE}/api/calendar/${id}`, { method: 'DELETE' })
      .then(() => setCalendarEvents(prev => prev.filter(e => e.id !== id)));
  };

  const handleUseTemplate = (template) => {
    handleSaveMemory({
      title: template.title,
      content_html: template.content_html,
      content_text: template.content_text,
      mood: template.mood,
      tags: template.tags,
      is_pinned: 0
    });
    setCurrentView('notes');
  };

  const trashMemories = memories.filter(m => m.is_trash);

  // If in Marketing Landing Page view mode
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage onLaunchApp={handleOpenAuthOrApp} />
        <AuthModal 
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Sidebar 
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'templates') {
            setIsTemplatesOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        setSelectedNotebook={setSelectedNotebook}
        onNewNote={() => {
          setActiveMemory(null);
          setCurrentView('notes');
        }}
        onNewNotebook={() => setCurrentView('notebooks')}
        onOpenSearch={() => setIsSearchOpen(true)}
        user={user}
        onLogout={handleLogout}
        onBackToLanding={() => setViewMode('landing')}
      />

      <main className="flex-1 overflow-y-auto min-h-screen">
        {currentView === 'home' && (
          <HomeDashboard 
            user={user}
            memories={memories}
            tasks={tasks}
            calendarEvents={calendarEvents}
            onSelectMemory={(mem) => {
              setActiveMemory(mem);
              setCurrentView('notes');
            }}
            onNewNote={() => {
              setActiveMemory(null);
              setCurrentView('notes');
            }}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onNavigateView={(v) => setCurrentView(v)}
          />
        )}

        {currentView === 'notes' && (
          <NoteEditor 
            memories={memories}
            activeMemory={activeMemory}
            onSelectMemory={setActiveMemory}
            onSaveMemory={handleSaveMemory}
            onDeleteMemory={handleDeleteMemory}
            notebooks={notebooks}
            onNewNote={() => setActiveMemory(null)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedNotebook={selectedNotebook}
          />
        )}

        {currentView === 'notebooks' && (
          <NotebooksView 
            notebooks={notebooks}
            onCreateNotebook={handleCreateNotebook}
            onDeleteNotebook={handleDeleteNotebook}
            onSelectNotebook={(nb) => {
              setSelectedNotebook(nb);
              setCurrentView('notes');
            }}
          />
        )}

        {currentView === 'tasks' && (
          <TasksView 
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView 
            calendarEvents={calendarEvents}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            memories={memories}
          />
        )}

        {currentView === 'trash' && (
          <TrashView 
            trashMemories={trashMemories}
            onRestoreMemory={handleRestoreMemory}
            onPermanentDelete={handlePermanentDelete}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView 
            user={user}
            memoriesCount={memories.filter(m => !m.is_trash).length}
            notebooksCount={notebooks.length}
            tasksCount={tasks.length}
          />
        )}
      </main>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        memories={memories}
        onSelectMemory={(mem) => {
          setActiveMemory(mem);
          setCurrentView('notes');
        }}
      />

      <TemplatesModal 
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}
