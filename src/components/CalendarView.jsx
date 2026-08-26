import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Tag, Trash2, ArrowRight } from 'lucide-react';

export default function CalendarView({ calendarEvents, onAddEvent, onDeleteEvent, memories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [category, setCategory] = useState('Work');
  const [location, setLocation] = useState('');
  const [memoryId, setMemoryId] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    onAddEvent({ title, event_date: eventDate, start_time: startTime, category, location, memory_id: memoryId || null });
    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Calendar & Schedule Integration</h1>
          <p className="text-xs text-slate-400 mt-1">Connect calendar events directly to meeting notes and agendas.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white emerald-gradient rounded-xl shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Calendar Event</span>
        </button>
      </div>

      {/* Events Agenda List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming Events & Connected Notes</h2>
          {calendarEvents.length === 0 ? (
            <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
              No calendar events scheduled yet.
            </div>
          ) : (
            calendarEvents.map(ev => (
              <div 
                key={ev.id}
                className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-sm font-extrabold text-white">{new Date(ev.event_date).getDate()}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        {ev.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500 inline mr-0.5" />
                        {ev.start_time}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {ev.title}
                    </h3>

                    {ev.location && (
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{ev.location}</span>
                      </p>
                    )}

                    {ev.memory_title && (
                      <div className="mt-2 inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        <span>Note: {ev.memory_title}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onDeleteEvent(ev.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Info Widget */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit space-y-4">
          <h3 className="text-sm font-bold text-white">Why Link Calendar to Notes?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In Evernote & Memories, connecting calendar events to notes automatically prepares your meeting agendas, action items, and follow-up tasks ahead of time.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-emerald-300 flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Synced with local SQLite schedule database.</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Calendar Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q3 Design Review, Coffee Cupping"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                  <input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Time</label>
                  <input 
                    type="text" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Connect to Existing Note</label>
                <select 
                  value={memoryId}
                  onChange={(e) => setMemoryId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="">None (Standalone event)</option>
                  {memories.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={!title.trim()} className="px-5 py-2 text-xs font-bold text-white emerald-gradient rounded-xl disabled:opacity-50">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
