import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mongoose Transform Option for frontend compatibility (_id -> id)
const transformOption = {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : ret.id;
    return ret;
  }
};

// 1. User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  avatar: String,
  plan: { type: String, default: 'Evernote Personal' }
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 2. Notebook Schema
const NotebookSchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  name: { type: String, required: true },
  description: String,
  color: { type: String, default: '#14A053' },
  icon: { type: String, default: 'Book' },
  is_favorite: { type: Boolean, default: false }
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 3. Memory Schema
const MemorySchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  notebook_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Notebook', default: null },
  title: { type: String, required: true },
  content_html: String,
  content_text: String,
  mood: { type: String, default: '😊 Joy' },
  is_pinned: { type: Boolean, default: false },
  is_trash: { type: Boolean, default: false },
  location: String,
  audio_url: String,
  tags: String
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 4. Task Schema
const TaskSchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  memory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Memory', default: null },
  title: { type: String, required: true },
  due_date: String,
  priority: { type: String, default: 'Medium' },
  is_completed: { type: Boolean, default: false }
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 5. Calendar Event Schema
const CalendarEventSchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  memory_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Memory', default: null },
  title: { type: String, required: true },
  event_date: { type: String, required: true },
  start_time: String,
  end_time: String,
  category: { type: String, default: 'Personal' },
  location: String
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 6. Tag Schema
const TagSchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  name: { type: String, required: true, unique: true },
  color: { type: String, default: '#14A053' }
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// 7. Scratchpad Schema
const ScratchpadSchema = new mongoose.Schema({
  user_id: { type: String, default: '1' },
  content: { type: String, default: '' }
}, { timestamps: true, toJSON: transformOption, toObject: transformOption });

// Export Mongoose Models
export const User = mongoose.model('User', UserSchema);
export const Notebook = mongoose.model('Notebook', NotebookSchema);
export const Memory = mongoose.model('Memory', MemorySchema);
export const Task = mongoose.model('Task', TaskSchema);
export const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);
export const Tag = mongoose.model('Tag', TagSchema);
export const Scratchpad = mongoose.model('Scratchpad', ScratchpadSchema);

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memories_db';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('🍃 MongoDB connected successfully!');
    await seedDatabase();
  } catch (err) {
    console.warn('⚠️ Could not connect to local MongoDB daemon. Attempting Memory Server / Fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`🚀 In-Memory MongoDB Server connected at: ${inMemoryUri}`);
      await seedDatabase();
    } catch (memErr) {
      console.error('MongoDB Connection Error:', memErr.message);
      // Fail gracefully so server remains alive
    }
  }
}

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('🌱 Seeding MongoDB database with initial demo data...');

    await User.create({
      email: 'alex@memories.app',
      password_hash: '$2a$10$demoHashForEvernoteMemoriesApp123456789',
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      plan: 'Evernote Personal'
    });

    const nbPersonal = await Notebook.create({ name: 'Personal Journal', description: 'Daily reflections, personal growth, and life milestones.', color: '#14A053', icon: 'BookOpen', is_favorite: true });
    const nbWork = await Notebook.create({ name: 'Work & Projects', description: 'Project plans, meeting notes, sprint retrospectives.', color: '#2563EB', icon: 'Briefcase', is_favorite: true });
    const nbTravel = await Notebook.create({ name: 'Travel & Adventures', description: 'Trip itineraries, flight bookings, and travel memories.', color: '#8B5CF6', icon: 'Compass', is_favorite: false });
    const nbIdeas = await Notebook.create({ name: 'Ideas & Brainstorms', description: 'Product concepts, creative inspirations, and book quotes.', color: '#F59E0B', icon: 'Lightbulb', is_favorite: true });
    await Notebook.create({ name: 'Recipes & Culinary', description: 'Favorite home recipes, coffee notes, and wine ratings.', color: '#EC4899', icon: 'Utensils', is_favorite: false });

    await Tag.create([
      { name: '#milestone', color: '#14A053' },
      { name: '#work', color: '#2563EB' },
      { name: '#travel', color: '#8B5CF6' },
      { name: '#ideas', color: '#F59E0B' },
      { name: '#reflection', color: '#10B981' }
    ]);

    const mem1 = await Memory.create({
      notebook_id: nbPersonal._id,
      title: '🌟 Launching the New "Memories" MongoDB Workspace',
      content_html: `<h1>Launching Memories App</h1><p>Today marks the start of a whole new chapter! We migrated <strong>Memories</strong> to a sleek <strong>MongoDB + Express REST API</strong> engine inspired by Evernote.</p><p>Key Features completed today:</p><ul><li>MongoDB & Mongoose document persistence</li><li>Rich text note editing with custom formatting</li><li>Notebook organization & tag filters</li><li>Tasks checklist with due date notifications</li><li>Calendar schedule integration</li><li>AI assistant note summarizer & polisher</li></ul><blockquote style="border-left: 3px solid #14A053; padding-left: 10px; color: #64748b;">"Your mind is for having ideas, not holding them." — David Allen</blockquote>`,
      content_text: 'Today marks the start of a whole new chapter! We migrated Memories to a sleek MongoDB + Express REST API engine inspired by Evernote.',
      mood: '🚀 Growth',
      is_pinned: true,
      is_trash: false,
      location: 'San Francisco, CA',
      tags: '#milestone, #work, #ideas'
    });

    const mem2 = await Memory.create({
      notebook_id: nbPersonal._id,
      title: '☕ Coffee Roasting Workshop Notes',
      content_html: `<h2>Ethiopian Yirgacheffe Tasting Notes</h2><p>Attended the barista masterclass at Artisans Roast today. Learned about light roast vs dark roast extraction curves.</p><p><strong>Flavor Profile:</strong> Jasmine aroma, bergamot citrus acidity, silky honey finish.</p><p><strong>Brew Ratio:</strong> 18g coffee to 300g water at 93°C with a 3-minute pour-over process.</p>`,
      content_text: 'Attended the barista masterclass at Artisans Roast today. Flavor Profile: Jasmine aroma, bergamot citrus acidity.',
      mood: '😊 Joy',
      is_pinned: true,
      is_trash: false,
      location: 'Portland, OR',
      tags: '#reflection, #ideas'
    });

    const mem3 = await Memory.create({
      notebook_id: nbWork._id,
      title: '📋 Q3 Product Strategy & Roadmap Meeting',
      content_html: `<h2>Q3 Strategic Objectives</h2><p>Met with design and engineering teams to define key deliverables for Q3 product sprint.</p><ol><li><strong>MongoDB Integration:</strong> Full document storage schemas and query indexing.</li><li><strong>Offline Syncing:</strong> Implement local caching fallback.</li><li><strong>AI Assistant:</strong> Add one-click voice memo transcription to note text.</li></ol>`,
      content_text: 'Met with design and engineering teams to define key deliverables for Q3 product sprint.',
      mood: '💡 Insight',
      is_pinned: false,
      is_trash: false,
      location: 'HQ Conference Room 3B',
      tags: '#work, #urgent'
    });

    await Memory.create({
      notebook_id: nbTravel._id,
      title: '✈️ Kyoto & Tokyo Autumn Travel Itinerary',
      content_html: `<h2>Japan Trip Planning (10 Days)</h2><p><strong>Day 1-3: Tokyo</strong></p><ul><li>Shinjuku Gyoen National Garden foliage walk</li><li>TeamLab Planets digital art exhibit</li></ul><p><strong>Day 4-7: Kyoto</strong></p><ul><li>Fushimi Inari Shrine early morning hike</li><li>Traditional Ryokan stay in Gion</li></ul>`,
      content_text: 'Japan Trip Planning (10 Days): Tokyo, Kyoto, Ryokan stay with Onsen.',
      mood: '🌿 Calm',
      is_pinned: false,
      is_trash: false,
      location: 'Kyoto, Japan',
      tags: '#travel, #milestone'
    });

    await Task.create([
      { memory_id: mem1._id, title: 'Review Q3 product design wireframes', due_date: '2026-08-26', priority: 'High', is_completed: false },
      { memory_id: mem1._id, title: 'Schedule weekly team retrospective meeting', due_date: '2026-08-27', priority: 'Medium', is_completed: false },
      { memory_id: mem3._id, title: 'Test MongoDB Mongoose queries & performance indexes', due_date: '2026-08-28', priority: 'High', is_completed: true },
      { memory_id: mem2._id, title: 'Send updated barista workshop summary notes to Sam', due_date: '2026-08-29', priority: 'Low', is_completed: false }
    ]);

    await CalendarEvent.create([
      { memory_id: mem1._id, title: '🚀 Memories MongoDB Web App Launch Demo', event_date: '2026-08-26', start_time: '10:00 AM', end_time: '11:00 AM', category: 'Work', location: 'Main Hall' },
      { memory_id: mem3._id, title: '☕ Coffee Cupping & Tasting Session', event_date: '2026-08-29', start_time: '04:00 PM', end_time: '05:30 PM', category: 'Personal', location: 'Artisan Cafe' }
    ]);

    await Scratchpad.create({
      content: 'Quick scratchpad notes:\n- Call Sarah regarding design system colors\n- Double check MongoDB connection indexes\n- Celebrate Memories launch! 🎉'
    });

    console.log('✅ MongoDB database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}
