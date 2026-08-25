import express from 'express';
import { Task } from '../db.js';

const router = express.Router();

// Get Tasks
router.get('/', async (req, res) => {
  try {
    const { is_completed, priority, memory_id } = req.query;
    const filter = {};

    if (is_completed !== undefined) {
      filter.is_completed = is_completed === '1' || is_completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }
    if (memory_id) {
      filter.memory_id = memory_id;
    }

    const tasks = await Task.find(filter)
      .populate('memory_id', 'title')
      .sort({ is_completed: 1, due_date: 1, createdAt: -1 });

    const formatted = tasks.map(t => {
      const obj = t.toJSON();
      if (t.memory_id) {
        obj.memory_title = t.memory_id.title;
      }
      return obj;
    });

    res.json({ tasks: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Task
router.post('/', async (req, res) => {
  try {
    const { memory_id, title, due_date, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Task title is required' });

    const newTask = await Task.create({
      memory_id: memory_id || null,
      title,
      due_date: due_date || null,
      priority: priority || 'Medium',
      is_completed: false
    });

    const populated = await Task.findById(newTask._id).populate('memory_id', 'title');
    const obj = populated.toJSON();
    if (populated.memory_id) {
      obj.memory_title = populated.memory_id.title;
    }
    res.status(201).json({ task: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task / Toggle completion
router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('memory_id', 'title');

    if (!updated) return res.status(404).json({ error: 'Task not found' });

    const obj = updated.toJSON();
    if (updated.memory_id) {
      obj.memory_title = updated.memory_id.title;
    }
    res.json({ task: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
