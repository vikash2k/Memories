import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { User, Memory, Notebook } from '../server/db.js';

console.log('Connecting to Atlas at:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas Cloud Database successfully!');
    const usersCount = await User.countDocuments();
    const notesCount = await Memory.countDocuments();
    console.log(`Current Atlas stats - Users: ${usersCount}, Notes: ${notesCount}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });
