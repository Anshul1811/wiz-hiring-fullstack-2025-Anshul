import express from 'express';
import { bookSlot, getUserBookings } from '../controllers/bookingController.js';
import {authenticate} from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/events/:id/bookings', authenticate, bookSlot);
router.get('/users/:email/bookings', authenticate, getUserBookings);

export default router;
