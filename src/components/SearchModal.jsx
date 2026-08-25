import React, { useState, useEffect } from 'react';
import { Search, FileText, ArrowRight, BookOpen } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, memories, onSelectMemory }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle modal
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const results = query.trim() 
    ? memories.filter(m => 
        !m.is_trash && (
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          (m.content_text && m.content_text.toLowerCase().includes(query.toLowerCase())) ||
          (m.tags && m.tags.toLowerCase().includes(query.toLowerCase()))
        )
      )
    : memories.filter(m => !m.is_trash).slice(0, 5);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Type to search memories, text content, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-medium"
          />
          <button onClick={onClose} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">ESC</button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Recent Memories'}
          </div>

          {results.map(mem => (
            <div 
              key={mem.id}
              onClick={() => {
                onSelectMemory(mem);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-3 truncate">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {mem.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {mem.content_text || 'No preview text'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
