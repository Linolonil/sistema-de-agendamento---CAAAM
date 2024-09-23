import mongoose from 'mongoose';
import Room from '../models/Room.js';  // Certifique-se de que o caminho está correto
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

  // Dados de exemplo
  const rooms = [];
  for (let i = 1; i <= 13; i++) {
    rooms.push({
      number: i,
      isAvailable: false,
      hasAirConditioning: false,
      hasTV: false,
      capacity: 20,  // Exemplo de capacidade; ajuste conforme necessário
    });
  }

  // Salvar as salas no banco de dados
  for (const roomData of rooms) {
    const room = new Room(roomData);
    await room.save();
    console.log(`Sala número ${roomData.number} salva com sucesso.`);
  }

  mongoose.connection.close();
};

seedRooms();
