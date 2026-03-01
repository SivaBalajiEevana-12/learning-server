import { registerUser } from '../controllers/userAuthController';
import express from 'express';
const router = express.Router();

router.get('/register',registerUser);

export default router;