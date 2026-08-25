import React from 'react';
import { Layout, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function TemplatesModal({ isOpen, onClose, onUseTemplate }) {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'meeting',
      title: '📋 Executive Meeting Minutes',
      category: 'Work & Projects',
      description: 'Structured agenda, attendees, key discussion points, and action items checklist.',
      content_html: `<h1>Executive Meeting Minutes</h1><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><p><strong>Attendees:</strong> [Names]</p><h2>Agenda Items</h2><ol><li>Project status update</li><li>Budget review</li><li>Q3 Sprint goals</li></ol><h2>Action Items</h2><ul><li>[ ] Follow up with design team</li><li>[ ] Schedule follow up demo</li></ul>`,
      content_text: 'Executive Meeting Minutes: Agenda items, attendees, action items checklist.',
      mood: '💡 Insight',
      tags: '#work, #meeting'
    },
    {
      id: 'journal',
      title: '🌱 Daily Reflection & Gratitude Journal',
      category: 'Personal Journal',
      description: 'Daily morning thoughts, 3 things you are grateful for, and evening recap.',
      content_html: `<h1>Daily Reflection Journal</h1><p><strong>Today's Date:</strong> ${new Date().toLocaleDateString()}</p><h2>Morning Gratitude 🌿</h2><ul><li>1. </li><li>2. </li><li>3. </li></ul><h2>Daily Goal & Intention 🚀</h2><p>Today I want to focus on...</p><h2>Evening Reflection 🌙</h2><p>What went well today?</p>`,
      content_text: 'Daily Reflection Journal: Morning gratitude, daily goal, evening reflection.',
      mood: '🌿 Calm',
      tags: '#reflection, #milestone'
    },
    {
      id: 'travel',
      title: '✈️ Complete Travel & Trip Planner',
      category: 'Travel & Adventures',
      description: 'Flight bookings, hotel addresses, daily itinerary breakdown, and packing list.',
      content_html: `<h1>Travel & Trip Planner</h1><h2>Trip Overview</h2><p><strong>Destination:</strong> </p><p><strong>Dates:</strong> </p><h2>Daily Itinerary</h2><p><strong>Day 1:</strong> Arrival & Hotel check-in</p><p><strong>Day 2:</strong> Sightseeing & Food tour</p><h2>Packing Checklist</h2><ul><li>[ ] Passport & Tickets</li><li>[ ] Universal Power Adapter</li><li>[ ] Camera & Chargers</li></ul>`,
      content_text: 'Travel & Trip Planner: Destination, flight details, daily itinerary, packing checklist.',
      mood: '😊 Joy',
      tags: '#travel'
    },
    {
      id: 'recipe',
      title: '☕ Artisanal Coffee & Recipe Notes',
      category: 'Recipes & Culinary',
      description: 'Tasting profile, brew ratios, extraction notes, and culinary ingredients.',
      content_html: `<h1>Artisanal Coffee Tasting Notes</h1><p><strong>Bean Origin:</strong> </p><p><strong>Roaster:</strong> </p><h2>Brewing Parameters</h2><ul><li><strong>Dose:</strong> 18g</li><li><strong>Yield:</strong> 36g</li><li><strong>Water Temp:</strong> 93°C</li></ul><h2>Flavor Notes</h2><p>Floral aroma, citrus acidity, caramel sweetness.</p>`,
      content_text: 'Artisanal Coffee Tasting Notes: Origin, brewing parameters, flavor notes.',
      mood: '😊 Joy',
      tags: '#ideas, #reflection'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-6 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Layout className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Memories Template Gallery</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pr-1">
          {templates.map(tpl => (
            <div 
              key={tpl.id}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                  {tpl.category}
                </span>
                <h4 className="text-base font-bold text-white mt-2 mb-1 group-hover:text-emerald-400 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {tpl.description}
                </p>
              </div>

              <button 
                onClick={() => {
                  onUseTemplate(tpl);
                  onClose();
                }}
                className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1 border border-slate-800"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
