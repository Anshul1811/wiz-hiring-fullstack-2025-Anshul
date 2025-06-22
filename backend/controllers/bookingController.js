import db from '../models/index.js';
import sendMail from '../utils/mailer.js'

export const bookSlot = async (req, res) => {
  try {
    const userId = req.user.userId;
    const eventId = req.params.id;
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const slot = await db.TimeSlot.findOne({
      where: { id: slotId, event_id: eventId }
    });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found for this event' });
    }

    const existingBookingsCount = await db.Booking.count({
      where: { slot_id: slotId }
    });

    if (existingBookingsCount >= slot.max_bookings) {
      return res.status(400).json({ message: 'Slot is fully booked' });
    }

    const existingBooking = await db.Booking.findOne({
      where: { user_id: userId, slot_id: slotId }
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this slot' });
    }

    // Create the booking
    const booking = await db.Booking.create({
      user_id: userId,
      slot_id: slotId,
    });

    // Fetch user email for notification
    const user = await db.User.findByPk(userId);
    if (user?.email) {
      // Send confirmation email
      await sendMail({
        to: user.email,
        subject: 'Booking Confirmation - BookMySlot',
        html: `
          <h2>Booking Confirmed!</h2>
          <p>You have successfully booked a slot for: <strong>${event.title}</strong></p>
          <p><strong>Date & Time:</strong> ${new Date(slot.start_time).toLocaleString()}</p>
          <p>We look forward to seeing you!</p>
        `,
      });
    }

    return res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  
 export const getUserBookings = async (req, res) => {
    try {
      const email = req.params.email;
  
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get bookings with associated slot and event info
      const bookings = await db.Booking.findAll({
        where: { user_id: user.id },
        include: [
          {
            model: db.TimeSlot,
            attributes: ['id', 'start_time', 'max_bookings'],
            include: [
              {
                model: db.Event,
                attributes: ['id', 'title', 'description', 'image'],
              },
            ],
          },
        ],
      });
  
      return res.status(200).json({ bookings });
    } catch (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  