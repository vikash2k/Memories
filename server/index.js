import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, Scratchpad, Tag } from './db.js';

import authRoutes from './routes/auth.js';
import memoriesRoutes from './routes/memories.js';
import notebooksRoutes from './routes/notebooks.js';
import tasksRoutes from './routes/tasks.js';
import calendarRoutes from './routes/calendar.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/notebooks', notebooksRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/ai', aiRoutes);

// Scratchpad API
app.get('/api/scratchpad', async (req, res) => {
  try {
    const pad = await Scratchpad.findOne();
    res.json({ content: pad ? pad.content : '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scratchpad', async (req, res) => {
  try {
    const { content } = req.body;
    let pad = await Scratchpad.findOne();
    if (!pad) {
      pad = await Scratchpad.create({ content });
    } else {
      pad.content = content;
      await pad.save();
    }
    res.json({ success: true, content: pad.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tags List API
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Memories MongoDB Engine', database: 'MongoDB/Mongoose', timestamp: new Date() });
});

// Connect Database & Start Server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Memories MongoDB Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize MongoDB Database:', err);
  });
