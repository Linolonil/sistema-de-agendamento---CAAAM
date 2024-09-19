import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedUsers from './userSeed.js';
import seedLawyers from './lawyerSeed.js';
import seedRoom from './roomSeed.js';

dotenv.config();

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerrar o processo em caso de erro de conexão
  }
};

// Função para rodar os seeds
export const runSeeds = async () => {
  await connectDB();

  try {
    console.log('Iniciando o seed de usuários, advogados e agendamentos...');
    await Promise.all([
      seedUsers(),
      seedLawyers(),
      seedRoom()
    ]);
    console.log('Todos os seeds concluídos.');
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
  } finally {
    mongoose.connection.close();
    console.log('Conexão com o MongoDB fechada.');
  }
};

runSeeds();
