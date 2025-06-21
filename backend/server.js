import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,  // important to allow cookies to be sent
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log(' MySQL DB Synced');
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
}).catch((err) => {
  console.error('DB Connection Failed:', err);
});
