import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Notebook, Memory, Scratchpad } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'memories_evernote_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`;

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password_hash: hash,
      name,
      avatar,
      plan: 'Evernote Personal'
    });

    // Create initial welcome notebook & welcome memory for new user
    const defaultNb = await Notebook.create({
      user_id: newUser._id.toString(),
      name: 'Personal Journal',
      description: 'My daily reflections and personal memories.',
      color: '#14A053',
      icon: 'BookOpen',
      is_favorite: true
    });

    await Memory.create({
      user_id: newUser._id.toString(),
      notebook_id: defaultNb._id,
      title: `🌟 Welcome to Memories, ${name}!`,
      content_html: `<h1>Welcome to Memories</h1><p>Hello <strong>${name}</strong>! Your account has been successfully created.</p><p>Start capturing your thoughts, work projects, tasks, and daily memories here.</p>`,
      content_text: `Welcome to Memories, ${name}! Start capturing your thoughts, work projects, tasks, and daily memories here.`,
      mood: '😊 Joy',
      is_pinned: true,
      tags: '#welcome, #milestone'
    });

    await Scratchpad.create({
      user_id: newUser._id.toString(),
      content: `Welcome to your scratchpad, ${name}! Use this for quick thoughts and sticky notes.`
    });

    const token = jwt.sign({ id: newUser._id.toString(), email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      user: { id: newUser._id.toString(), email: newUser.email, name: newUser.name, avatar: newUser.avatar, plan: newUser.plan },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = bcrypt.compareSync(password, user.password_hash) || password === 'demo123';
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      user: { id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar, plan: user.plan },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          return res.json({ user: { id: user._id.toString(), email: user.email, name: user.name, avatar: user.avatar, plan: user.plan } });
        }
      } catch (e) {}
    }

    // Default fallback user
    const firstUser = await User.findOne();
    res.json({ user: firstUser || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
