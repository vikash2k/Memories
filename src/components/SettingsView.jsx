import React from 'react';
import { User, ShieldCheck, Database, Sliders, CheckCircle2, Sparkles } from 'lucide-react';

export default function SettingsView({ user, memoriesCount, notebooksCount, tasksCount }) {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Account & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account profile, subscription plan, and database metrics.</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center space-x-4">
        <img 
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
          alt="Avatar"
          className="w-16 h-16 rounded-full border-2 border-emerald-500/50 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white">{user?.name || 'Alex Vance'}</h2>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              {user?.plan || 'Evernote Personal'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'alex@memories.app'}</p>
        </div>
      </div>

      {/* Database Metrics */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">SQLite Local Storage Statistics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Total Notes</span>
            <p className="text-2xl font-extrabold text-white mt-1">{memoriesCount}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Notebook Stacks</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{notebooksCount}</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">Tasks Logged</span>
            <p className="text-2xl font-extrabold text-blue-400 mt-1">{tasksCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
