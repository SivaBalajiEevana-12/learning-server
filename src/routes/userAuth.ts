import authMiddleware from '../middlewares/authmiddleware';
import { registerUser,loginUser,logoutUser } from '../controllers/userAuthController';
import express from 'express';
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',authMiddleware,logoutUser);

export default router;