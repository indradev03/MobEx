// backend/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user/userRoute.js';
import adminRoutes from './routes/admin/index.js';
import brandRoutes from './routes/admin/brands/brandRoutes.js'; 
import productRoutes from './routes/admin/addproduct/productRoutes.js'
import wishlistRoutes from './routes/wishlist/wishlist.js';
import cartRoutes from './routes/cart/cartRoutes.js';
import orderRoutes from './routes/order/orderRoutes.js';
import adminOrderRoute from './routes/order/adminOrderRoute.js';
import statsRoutes from './routes/admin/statsRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/brands', brandRoutes); 
app.use("/api/products", productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/admorders', adminOrderRoute);
app.use("/api/stats", statsRoutes);
app.use("/uploads", express.static("uploads"));

// Health check
app.get('/', (req, res) => {
  res.send('🚀 MobEx API is running...');
});

export default app;
