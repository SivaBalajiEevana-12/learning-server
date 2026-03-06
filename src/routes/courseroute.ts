import { createCourse } from "../controllers/courseController";
import express from 'express';
const router = express.Router();
router.post('/create',createCourse);
export default router;