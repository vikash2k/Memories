import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Pin, Trash2, Tag, Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Code, Quote, CheckSquare, Search, Plus, Save, 
  Download, Printer, Share2, CornerUpLeft, BookOpen, Smile, MapPin, Check
} from 'lucide-react';

export default function NoteEditor({ 
  memories, 
  activeMemory, 
  onSelectMemory, 
  onSaveMemory, 
  onDeleteMemory, 
  notebooks, 
  onNewNote,
  searchQuery,
  setSearchQuery,
  selectedNotebook
}) {
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [contentText, setContentText] = useState('');
  const [notebookId, setNotebookId] = useState('');
  const [mood, setMood] = useState('😊 Joy');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [location, setLocation] = useState('');

  // AI Modal state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Sync state when active memory changes
  useEffect(() => {
    if (activeMemory) {
      setTitle(activeMemory.title || '');
      setContentHtml(activeMemory.content_html || '');
      setContentText(activeMemory.content_text || '');
      setNotebookId(activeMemory.notebook_id || '');
      setMood(activeMemory.mood || '😊 Joy');
      setTags(activeMemory.tags || '');
      setIsPinned(!!activeMemory.is_pinned);
      setLocation(activeMemory.location || '');
    } else {
      setTitle('');
      setContentHtml('');
      setContentText('');
      setNotebookId(selectedNotebook?.id || '');
      setMood('😊 Joy');
      setTags('');
      setIsPinned(false);
      setLocation('');
    }
  }, [activeMemory, selectedNotebook]);

  // Handle Save
  const handleSave = () => {
    if (!title.trim() && !contentText.trim()) return;

    const payload = {
      id: activeMemory?.id,
      title: title || 'Untitled Memory',
      content_html: contentHtml || `<p>${contentText}</p>`,
      content_text: contentText || title,
      notebook_id: notebookId ? parseInt(notebookId) : null,
      mood,
      tags,
      is_pinned: isPinned ? 1 : 0,
      location
    };

    onSaveMemory(payload);
  };

  // Helper formatting insert
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // AI Assistant triggers
  const handleAiSummarize = () => {
    setAiLoading(true);
    fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: contentText || title })
    })
      .then(res => res.json())
      .then(data => {
        setAiResult(data);
        setAiLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAiLoading(false);
      });
  };

  const handleAiEnhance = (tone) => {
    setAiLoading(true);
    fetch('/api/ai/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: contentText || title, tone })
    })
      .then(res => res.json())
      .then(data => {
        if (data.enhancedText) {
          setContentText(data.enhancedText);
          setContentHtml(`<p>${data.enhancedText.replace(/\n/g, '<br/>')}</p>`);
        }
        setAiLoading(false);
        setIsAiOpen(false);
      })
      .catch(err => {
        console.error(err);
        setAiLoading(false);
      });
  };

  const wordCount = contentText.trim() ? contentText.trim().split(/\s+/).length : 0;

  const filteredMemories = memories.filter(m => {
    if (m.is_trash) return false;
    if (selectedNotebook && m.notebook_id !== selectedNotebook.id) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.content_text && m.content_text.toLowerCase().includes(q)) ||
        (m.tags && m.tags.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden bg-slate-950">
      {/* Left List Drawer */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {selectedNotebook ? selectedNotebook.name : 'All Memories'}
            </h2>
            <button 
              onClick={onNewNote}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              title="New Memory"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredMemories.map(mem => {
            const isSelected = activeMemory?.id === mem.id;
            return (
              <div 
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-md' 
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-emerald-400 font-medium">{mem.mood || '😊 Joy'}</span>
                  {mem.is_pinned ? <Pin className="w-3 h-3 text-amber-400 fill-amber-400" /> : null}
                </div>
                <h3 className="text-xs font-bold truncate">{mem.title || 'Untitled Memory'}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {mem.content_text || 'No additional text...'}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>{new Date(mem.created_at).toLocaleDateString()}</span>
                  <span className="text-emerald-400 truncate max-w-[100px]">{mem.tags}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Editor Main Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Editor Top Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            {/* Notebook Selector */}
            <select 
              value={notebookId}
              onChange={(e) => setNotebookId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="">No Notebook (General)</option>
              {notebooks.map(nb => (
                <option key={nb.id} value={nb.id}>{nb.name}</option>
              ))}
            </select>

            {/* Mood Selector */}
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-emerald-400 focus:outline-none font-bold"
            >
              <option value="😊 Joy">😊 Joy</option>
              <option value="💡 Insight">💡 Insight</option>
              <option value="🚀 Growth">🚀 Growth</option>
              <option value="🌿 Calm">🌿 Calm</option>
              <option value="🎨 Creative">🎨 Creative</option>
            </select>

            <button 
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-lg border transition-all ${
                isPinned 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
              title="Pin Memory"
            >
              <Pin className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsAiOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </button>

            <button 
              onClick={handleSave}
              className="px-4 py-1.5 emerald-gradient hover:opacity-90 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            {activeMemory && (
              <button 
                onClick={() => onDeleteMemory(activeMemory.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Move to Trash"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Rich WYSIWYG Formatting Toolbar */}
        <div className="px-6 py-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center space-x-1 overflow-x-auto text-slate-400 shrink-0">
          <button onClick={() => formatText('bold')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('italic')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('formatBlock', '<h1>')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('formatBlock', '<h2>')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button onClick={() => formatText('insertUnorderedList')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('insertOrderedList')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('formatBlock', '<pre>')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Code Block">
            <Code className="w-4 h-4" />
          </button>
          <button onClick={() => formatText('formatBlock', '<blockquote>')} className="p-1.5 hover:bg-slate-800 rounded hover:text-white" title="Quote Callout">
            <Quote className="w-4 h-4" />
          </button>

          <div className="ml-auto text-[11px] text-slate-500 font-mono">
            {wordCount} words
          </div>
        </div>

        {/* Main Note Canvas Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Note Title Input */}
          <input 
            type="text" 
            placeholder="Title of your memory..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-3xl font-extrabold text-white placeholder:text-slate-600 focus:outline-none tracking-tight"
          />

          {/* Tags & Metadata bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs text-slate-300">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <input 
                type="text"
                placeholder="Tags e.g. #work, #travel"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-transparent focus:outline-none text-emerald-400 font-mono placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-300 placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Note Content Textarea / Editable */}
          <textarea 
            placeholder="Start typing your note, memory, meeting transcript, or daily journal..."
            value={contentText}
            onChange={(e) => {
              setContentText(e.target.value);
              setContentHtml(`<p>${e.target.value.replace(/\n/g, '<br/>')}</p>`);
            }}
            className="w-full min-h-[400px] bg-transparent text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed text-base"
          />
        </div>
      </div>

      {/* AI Assistant Modal */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Memories AI Assistant</h3>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              Use AI to summarize this note, polish writing tone, or auto-generate task action items.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleAiSummarize}
                disabled={aiLoading}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all"
              >
                <span className="text-xs font-bold text-emerald-400 block mb-1">✨ Summarize Note</span>
                <span className="text-[11px] text-slate-400">Generate executive summary & bullet points.</span>
              </button>

              <button 
                onClick={() => handleAiEnhance('professional')}
                disabled={aiLoading}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition-all"
              >
                <span className="text-xs font-bold text-blue-400 block mb-1">📝 Polish Writing</span>
                <span className="text-[11px] text-slate-400">Format into professional business prose.</span>
              </button>
            </div>

            {aiLoading && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-emerald-400 animate-pulse">
                Analyzing note with Memories AI engine...
              </div>
            )}

            {aiResult && (
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2 text-xs text-slate-200">
                <p className="font-semibold text-emerald-400">{aiResult.summary}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  {aiResult.keyTakeaways.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
