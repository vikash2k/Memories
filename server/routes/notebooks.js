import express from 'express';
import { Notebook, Memory } from '../db.js';

const router = express.Router();

// Get all Notebooks with note counts
router.get('/', async (req, res) => {
  try {
    const notebooks = await Notebook.find().sort({ is_favorite: -1, name: 1 });

    const formatted = await Promise.all(
      notebooks.map(async (nb) => {
        const count = await Memory.countDocuments({ notebook_id: nb._id, is_trash: false });
        const obj = nb.toJSON();
        obj.note_count = count;
        return obj;
      })
    );

    res.json({ notebooks: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Notebook
router.post('/', async (req, res) => {
  try {
    const { name, description, color, icon, is_favorite } = req.body;
    if (!name) return res.status(400).json({ error: 'Notebook name is required' });

    const newNb = await Notebook.create({
      name,
      description: description || '',
      color: color || '#14A053',
      icon: icon || 'Book',
      is_favorite: !!is_favorite
    });

    const obj = newNb.toJSON();
    obj.note_count = 0;
    res.status(201).json({ notebook: obj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Notebook
router.put('/:id', async (req, res) => {
  try {
    const updated = await Notebook.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Notebook not found' });
    res.json({ notebook: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Notebook
router.delete('/:id', async (req, res) => {
  try {
    await Notebook.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
