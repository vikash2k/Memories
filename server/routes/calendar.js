import express from 'express';
import { CalendarEvent } from '../db.js';

const router = express.Router();

// Get Calendar Events
router.get('/', async (req, res) => {
  try {
    const { event_date } = req.query;
    const filter = {};

    if (event_date) {
      filter.event_date = event_date;
    }

    const events = await CalendarEvent.find(filter)
      .populate('memory_id', 'title')
      .sort({ event_date: 1, start_time: 1 });

    const formatted = events.map(e => {
      const obj = e.toJSON();
      if (e.memory_id) {
        obj.memory_title = e.memory_id.title;
      }
      return obj;
    });

    res.json({ events: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Calendar Event
router.post('/', async (req, res) => {
  try {
    const { memory_id, title, event_date, start_time, end_time, category, location } = req.body;
    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event_date are required' });
    }

    const newEv = await CalendarEvent.create({
      memory_id: memory_id || null,
      title,
      event_date,
      start_time: start_time || '09:00 AM',
      end_time: end_time || '10:00 AM',
      category: category || 'Personal',
      location: location || ''
    });

    const populated = await CalendarEvent.findById(newEv._id).populate('memory_id', 'title');
    const obj = populated.toJSON();
    if (populated.memory_id) {
      obj.memory_title = populated.memory_id.title;
    }
    res.status(201).json({ event: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Calendar Event
router.delete('/:id', async (req, res) => {
  try {
    await CalendarEvent.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
