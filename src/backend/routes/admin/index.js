import express from 'express';
import adminRoutes from './adminRoute.js';

const router = express.Router();

router.use('/', adminRoutes); // mounted at /api/admin from main server

export default router;
