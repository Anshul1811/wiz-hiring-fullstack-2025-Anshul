import express from 'express';
import { createEvent , getAllEvents, getEventById} from '../controllers/eventController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/events', authenticate, createEvent);
router.get('/events', authenticate, getAllEvents);
router.get('/events/:id', authenticate, getEventById);


export default router;
