import React, { useState } from 'react';
import { BookOpen, Plus, Star, Trash2, Edit2, ArrowRight, Folder } from 'lucide-react';

export default function NotebooksView({ 
  notebooks, 
  onCreateNotebook, 
  onDeleteNotebook, 
  onSelectNotebook 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#14A053');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateNotebook({ name, description, color });
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const colors = ['#14A053', '#2563EB', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#6366F1'];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Notebooks & Albums</h1>
          <p className="text-xs text-slate-400 mt-1">Organize your notes into color-coded stacks and categories.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white emerald-gradient rounded-xl shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Notebook</span>
        </button>
      </div>

      {/* Grid of Notebooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notebooks.map(nb => (
          <div 
            key={nb.id}
            className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: nb.color || '#14A053' }}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 border border-slate-800">
                    {nb.note_count || 0} notes
                  </span>
                  <button 
                    onClick={() => onDeleteNotebook(nb.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Notebook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {nb.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {nb.description || 'No description provided.'}
              </p>
            </div>

            <button 
              onClick={() => onSelectNotebook(nb)}
              className="mt-6 w-full py-2 bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-emerald-400 rounded-xl transition-colors flex items-center justify-center space-x-1.5 border border-slate-800"
            >
              <span>View Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Notebook</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Notebook Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Health & Fitness, Book Notes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea 
                  placeholder="What belongs in this notebook stack?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Notebook Color</label>
                <div className="flex items-center space-x-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!name.trim()}
                  className="px-5 py-2 text-xs font-bold text-white emerald-gradient rounded-xl disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
