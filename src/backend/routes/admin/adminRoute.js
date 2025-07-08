import express from 'express';
import { adminLogin, getAllAdmins, getAdminByEmail } from '../../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/', getAllAdmins);
router.get('/:email', getAdminByEmail); // Optional if you want to support GET by email

export default router;
