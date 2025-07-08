import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user/userRoute.js';
import adminRoutes from './routes/admin/index.js';  // admin route

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Now supports /login and / for admins

// Health check route
app.get('/', (req, res) => {
  res.send('🚀 MobEx API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
