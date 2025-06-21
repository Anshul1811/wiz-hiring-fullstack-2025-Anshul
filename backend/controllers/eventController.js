import db from '../models/index.js';

export const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, slots } = req.body;

    if (!title || !slots || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'Title and slots are required' });
    }

    for (const slot of slots) {
      if (!slot.start_time || typeof slot.max_bookings !== 'number' || slot.max_bookings < 1) {
        return res.status(400).json({
          message: 'Each slot must have a valid start_time and a max_bookings > 0',
        });
      }
    }

    const event = await db.Event.create({
      title,
      description,
      user_id: userId,
    });

    const createdSlots = await Promise.all(
      slots.map((slot) =>
        db.TimeSlot.create({
          event_id: event.id,
          start_time: slot.start_time,
          max_bookings: slot.max_bookings,
        })
      )
    );

    return res.status(201).json({ message: 'Event created', event, slots: createdSlots });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getAllEvents = async (req, res) => {
    try {
      const events = await db.Event.findAll({
        attributes: ['id', 'title', 'description', 'createdAt'],
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email'],
          },
          {
            model: db.TimeSlot,
            attributes: ['id'], 
          },
        ],
      });
  
      const formatted = events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        createdAt: event.createdAt,
        createdBy: event.User,
        totalSlots: event.Slots ? event.Slots.length : 0,
      }));
  
      return res.status(200).json({ events: formatted });
    } catch (error) {
      console.error('List events error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  

export const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const event = await db.Event.findByPk(id, {
        attributes: ['id', 'title', 'description', 'createdAt'],
        include: [
          {
            model: db.User,
            attributes: ['id', 'name', 'email'],
          },
          {
            model: db.TimeSlot,
            attributes: ['id', 'start_time', 'max_bookings'], // removed 'current_bookings'
          },
        ],
      });
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      return res.status(200).json({
        id: event.id,
        title: event.title,
        description: event.description,
        createdAt: event.createdAt,
        createdBy: event.User,
        slots: event.Slots || [], // or .timeSlots if you've aliased it
      });
    } catch (error) {
      console.error('Fetch event error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  