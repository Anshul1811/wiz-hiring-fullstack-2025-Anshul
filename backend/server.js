import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, 
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync({alter: true}).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});
