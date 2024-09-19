import express from 'express';
import cors from 'cors';
import dotenv from  'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import lawyerRoutes from './routes/lawyerRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

const app = express();

// dotenv
dotenv.config();

// conectar ao MongoDB
connectDB();

app.use(express.json());
app.use(cors())


//  rotas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/lawyer', lawyerRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/schedules', scheduleRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});