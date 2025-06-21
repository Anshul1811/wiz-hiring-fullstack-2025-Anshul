import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './User/User.js';
import EventModel from './Events/Event.js';
import TimeSlotModel from './Slots/Slot.js';
import BookingModel from './Booking/Booking.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Initialize models
const models = {};

models.User = UserModel(sequelize, DataTypes);
models.Event = EventModel(sequelize, DataTypes);
models.TimeSlot = TimeSlotModel(sequelize, DataTypes);
models.Booking = BookingModel(sequelize, DataTypes);

// Apply associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
