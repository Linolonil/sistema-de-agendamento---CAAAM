import mongoose from 'mongoose';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
};

// Função para popular os dados
export const seedRooms = async () => {
  await connectDB();

  // Dados de exemplo para 12 salas
  for (let i = 1; i <= 12; i++) {
    const room = new Room({
      number: i,
    });
    await room.save();
    console.log(`Sala ${i} salva com sucesso.`);
  }

  mongoose.connection.close();
};

seedRooms();
