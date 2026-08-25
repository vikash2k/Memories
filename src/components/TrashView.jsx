import React from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

export default function TrashView({ trashMemories, onRestoreMemory, onPermanentDelete }) {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Trash & Deleted Memories</h1>
        <p className="text-xs text-slate-400 mt-1">Notes in trash will remain accessible for recovery until permanently erased.</p>
      </div>

      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
        {trashMemories.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            <Trash2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p>Your Trash is currently empty.</p>
          </div>
        ) : (
          trashMemories.map(mem => (
            <div 
              key={mem.id}
              className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800/80"
            >
              <div>
                <h3 className="text-sm font-bold text-white line-through text-slate-400">{mem.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{mem.content_text || 'No preview text...'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onRestoreMemory(mem.id)}
                  className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
                <button 
                  onClick={() => onPermanentDelete(mem.id)}
                  className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Forever</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
