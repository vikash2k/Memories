import express from 'express';
import { Memory, Notebook } from '../db.js';

const router = express.Router();

// Get all memories/notes
router.get('/', async (req, res) => {
  try {
    const { notebook_id, search, is_pinned, is_trash, mood, tag } = req.query;

    const filter = {};

    if (is_trash !== undefined) {
      filter.is_trash = is_trash === '1' || is_trash === 'true';
    } else {
      filter.is_trash = false;
    }

    if (notebook_id) {
      filter.notebook_id = notebook_id;
    }

    if (is_pinned !== undefined) {
      filter.is_pinned = is_pinned === '1' || is_pinned === 'true';
    }

    if (mood) {
      filter.mood = mood;
    }

    if (tag) {
      filter.tags = { $regex: tag, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content_text: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const memories = await Memory.find(filter)
      .populate('notebook_id', 'name color')
      .sort({ is_pinned: -1, updatedAt: -1 });

    const formatted = memories.map(m => {
      const obj = m.toJSON();
      if (m.notebook_id) {
        obj.notebook_name = m.notebook_id.name;
        obj.notebook_color = m.notebook_id.color;
      }
      return obj;
    });

    res.json({ memories: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Memory
router.get('/:id', async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id).populate('notebook_id', 'name color');
    if (!memory) return res.status(404).json({ error: 'Memory not found' });
    
    const obj = memory.toJSON();
    if (memory.notebook_id) {
      obj.notebook_name = memory.notebook_id.name;
      obj.notebook_color = memory.notebook_id.color;
    }
    res.json({ memory: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Memory Note
router.post('/', async (req, res) => {
  try {
    const { notebook_id, title, content_html, content_text, mood, is_pinned, location, audio_url, tags } = req.body;

    const newMemory = await Memory.create({
      notebook_id: notebook_id || null,
      title: title || 'Untitled Memory',
      content_html: content_html || '',
      content_text: content_text || '',
      mood: mood || '😊 Joy',
      is_pinned: !!is_pinned,
      location: location || '',
      audio_url: audio_url || '',
      tags: tags || ''
    });

    const populated = await Memory.findById(newMemory._id).populate('notebook_id', 'name color');
    const obj = populated.toJSON();
    if (populated.notebook_id) {
      obj.notebook_name = populated.notebook_id.name;
    }
    res.status(201).json({ memory: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Memory Note
router.put('/:id', async (req, res) => {
  try {
    const updated = await Memory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('notebook_id', 'name color');

    if (!updated) return res.status(404).json({ error: 'Memory not found' });

    const obj = updated.toJSON();
    if (updated.notebook_id) {
      obj.notebook_name = updated.notebook_id.name;
    }
    res.json({ memory: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Move to trash or Delete Permanently
router.delete('/:id', async (req, res) => {
  try {
    const { permanent } = req.query;

    if (permanent === 'true') {
      await Memory.findByIdAndDelete(req.params.id);
      res.json({ success: true, id: req.params.id });
    } else {
      await Memory.findByIdAndUpdate(req.params.id, { is_trash: true });
      res.json({ success: true, message: 'Moved to Trash' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restore from Trash
router.post('/:id/restore', async (req, res) => {
  try {
    await Memory.findByIdAndUpdate(req.params.id, { is_trash: false });
    res.json({ success: true, message: 'Restored memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
