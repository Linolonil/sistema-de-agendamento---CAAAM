import mongoose from 'mongoose';
import Lawyer from '../models/Lawyer.js';  // Certifique-se de que o modelo Lawyer existe
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
export const seedLawyers = async () => {
  await connectDB();

  // Dados de exemplo
  const lawyers = [
    { name: 'Dr. John Doe', oab: '12345', phone: '123-456-7890' },
    { name: 'Dr. Jane Smith', oab: '67890', phone: '987-654-3210' },
  ];

  for (const lawyerData of lawyers) {
    const lawyer = new Lawyer(lawyerData);
    await lawyer.save();
    console.log(`Advogado ${lawyerData.name} salvo com sucesso.`);
  }

  mongoose.connection.close();
};

seedLawyers();
