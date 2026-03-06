import authMiddleware from '../middlewares/authmiddleware';
import { registerUser,loginUser,logoutUser,confirmEmail, forgotPassword, changePassword, updateProfile } from '../controllers/userAuthController';
import express from 'express';
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/confirm-email',confirmEmail);
router.post('/forgot-password',forgotPassword);
router.post('/change-password',changePassword);
router.put('/update-profile',authMiddleware,updateProfile);
export default router;