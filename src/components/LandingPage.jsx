import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, CheckCircle2, Calendar, FileText, Search, 
  ArrowRight, ShieldCheck, Zap, Layers, Share2, Award, ChevronRight, Play, Star
} from 'lucide-react';

export default function LandingPage({ onLaunchApp }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [clipperUrl, setClipperUrl] = useState('https://evernote.com/blog/future-of-notes');
  const [clippedSuccess, setClippedSuccess] = useState(false);

  const handleSimulateClip = () => {
    setClippedSuccess(true);
    setTimeout(() => setClippedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLaunchApp}>
            <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center shadow-lg emerald-glow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white">Memories</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full ml-2 border border-emerald-500/30">v2.4 Pro</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#web-clipper" className="hover:text-emerald-400 transition-colors">Web Clipper</a>
            <a href="#dashboard-preview" className="hover:text-emerald-400 transition-colors">Workspace</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLaunchApp}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onLaunchApp}
              className="px-5 py-2.5 text-sm font-semibold text-white emerald-gradient rounded-xl hover:opacity-95 transition-all shadow-lg emerald-glow flex items-center space-x-2"
            >
              <span>Launch Memories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Introducing Memories AI 2.0 & SQLite Sync Engine</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-8">
            Remember Everything. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Organize Anything.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Capture life's notes, work projects, tasks, daily reflections, and calendar schedules in one intelligent workspace. Your second brain, perfectly synchronized.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white emerald-gradient rounded-2xl shadow-xl emerald-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
            >
              <span>Open Memories Workspace Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#dashboard-preview"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 glass-panel rounded-2xl hover:bg-slate-800/80 transition-all flex items-center justify-center space-x-2 border border-slate-700"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Interactive Web App Showcase Mockup */}
          <div id="dashboard-preview" className="relative mx-auto max-w-5xl rounded-3xl p-3 glass-panel border border-slate-700/60 shadow-2xl overflow-hidden group">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 text-left overflow-hidden">
              {/* App Window Topbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-500 font-medium ml-2">Memories Desktop — Alex's Workspace</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">All changes saved</span>
                  <span>SQLite DB: Synced</span>
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Card: Quick Scratchpad */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scratchpad</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Auto-saving</span>
                  </div>
                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    • Finalize Q3 product specs<br />
                    • Call Sarah about coffee roast tasting notes ☕<br />
                    • Remember to check flight booking confirmation!
                  </p>
                </div>

                {/* Center Card: Note Preview */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">Work & Projects</span>
                      <span className="text-xs text-slate-400">😊 Joy</span>
                    </div>
                    <span className="text-xs text-slate-500">Updated 2m ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">🌟 Launching the New "Memories" Workspace</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Today marks the start of a whole new chapter! We built Memories as a sleek, powerful note-taking and memory vault inspired by Evernote...
                  </p>
                  <div className="flex items-center space-x-2 mt-4 text-xs text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400">#milestone</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400">#work</span>
                    <span className="ml-auto text-emerald-400 font-medium">Click to open full editor →</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={onLaunchApp}
                className="px-6 py-3 text-sm font-bold text-white emerald-gradient rounded-xl shadow-2xl emerald-glow flex items-center space-x-2"
              >
                <span>Enter Live Interactive App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Everything You Need in One Second Brain
            </h2>
            <p className="text-slate-400 text-lg">
              Designed with Evernote's signature productivity principles, optimized for speed, aesthetics, and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rich Text Notes & Journal</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Full WYSIWYG note editor supporting headers, checklists, code blocks, quote callouts, audio memos, and emotion tagging.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Notebooks & Color Stacks</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Organize thoughts into color-coded Notebooks (Personal, Work, Travel, Recipes) and create favorite shortcuts.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Integrated Tasks & Due Dates</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Link actionable tasks directly inside notes, set priorities (High, Medium, Low), and track completed goals.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Schedule & Calendar Linking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect calendar schedule events directly to your meeting notes and daily reflections for context.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Memory Assistant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instantly summarize long notes, polish writing tone, auto-extract action items, and auto-tag your entries.
              </p>
            </div>

            <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Local SQLite & Offline DB</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your data is stored in a robust relational database with ultra-fast search indexing and zero data lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Web Clipper Interactive Demo */}
      <section id="web-clipper" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1 mb-4 text-xs font-semibold text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Web Clipper Extension</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                Save Anything Online with One Click
              </h2>
              <p className="text-slate-400 text-base mb-8 leading-relaxed">
                Found an interesting article, travel recipe, or research paper? Use the Memories Web Clipper to capture full web pages, simplified articles, or quick screenshots directly into your Notebooks.
              </p>

              {/* Clipper Simulator Form */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Simulate Web Clipper URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={clipperUrl}
                    onChange={(e) => setClipperUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button 
                    onClick={handleSimulateClip}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center space-x-2 shrink-0"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Clip Webpage</span>
                  </button>
                </div>

                {clippedSuccess && (
                  <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Successfully clipped to notebook <strong>Ideas & Brainstorms</strong>! View in Memories app.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold text-slate-400">Chrome Extension Clipper Preview</span>
                <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-bold">Target Notebook</span>
                  <p className="text-sm font-semibold text-white mt-1">Personal Journal (Default)</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 uppercase font-bold">Clip Format</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 py-1.5 rounded text-xs font-semibold">Article</button>
                    <button className="bg-slate-800 text-slate-400 py-1.5 rounded text-xs font-semibold">Full Page</button>
                    <button className="bg-slate-800 text-slate-400 py-1.5 rounded text-xs font-semibold">Bookmark</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Choose the plan that fits your personal journaling or team collaboration workflow.
          </p>

          <div className="inline-flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 mb-16">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Monthly Billing
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${billingCycle === 'annual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Annual (Save 20%)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Free */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Starter</span>
                <h3 className="text-3xl font-extrabold text-white mt-4 mb-2">$0</h3>
                <p className="text-slate-400 text-sm mb-6">Perfect for basic note taking and personal daily scratchpads.</p>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Up to 50 Notes & Memories</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>1 Notebook Album</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Basic Tasks Checklist</span></li>
                </ul>
              </div>
              <button 
                onClick={onLaunchApp}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all text-center"
              >
                Get Started Free
              </button>
            </div>

            {/* Personal / Pro - Featured */}
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-emerald-500 relative shadow-2xl emerald-glow flex flex-col justify-between">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-1 rounded-full uppercase">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Evernote Personal</span>
                <h3 className="text-3xl font-extrabold text-white mt-4 mb-2">
                  {billingCycle === 'monthly' ? '$8.99' : '$6.99'} <span className="text-sm font-normal text-slate-400">/ mo</span>
                </h3>
                <p className="text-slate-400 text-sm mb-6">Everything you need to organize your work and personal life.</p>
                <ul className="space-y-3 text-sm text-slate-200 mb-8">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Unlimited Notes & Notebooks</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Full AI Summarizer & Text Polish</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Calendar Schedule Integration</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Web Clipper & Audio Memos</span></li>
                </ul>
              </div>
              <button 
                onClick={onLaunchApp}
                className="w-full py-3 emerald-gradient text-white font-extrabold rounded-xl text-sm transition-all text-center shadow-lg"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Professional */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional</span>
                <h3 className="text-3xl font-extrabold text-white mt-4 mb-2">
                  {billingCycle === 'monthly' ? '$14.99' : '$11.99'} <span className="text-sm font-normal text-slate-400">/ mo</span>
                </h3>
                <p className="text-slate-400 text-sm mb-6">For power users and small teams demanding maximum capability.</p>
                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Everything in Personal</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Team Workspace Sharing</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Export to PDF, MD, HTML</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Priority Support & Backups</span></li>
                </ul>
              </div>
              <button 
                onClick={onLaunchApp}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all text-center"
              >
                Choose Professional
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-slate-500 text-xs px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md emerald-gradient flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-300">Memories</span>
            <span>© 2026 Memories Inc. Inspired by Evernote.</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400">Security</a>
            <a href="#" className="hover:text-emerald-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
