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
    { name: 'Dr. João Silva', oab: '112233', phoneNumber: '111-222-3333', role: 'advogado' },
    { name: 'Dr. Maria Oliveira', oab: '445566', phoneNumber: '444-555-6666', role: 'advogado' },
    { name: 'Dr. Pedro Souza', oab: '778899', phoneNumber: '777-888-9999', role: 'assistente' },
    { name: 'Dr. Ana Costa', oab: '334455', phoneNumber: '333-444-5555', role: 'paralegal' },
    { name: 'Dr. Carlos Mendes', oab: '667788', phoneNumber: '666-777-8888', role: 'advogado' },
  ];

  for (const lawyerData of lawyers) {
    const lawyer = new Lawyer(lawyerData);
    await lawyer.save();
    console.log(`Advogado ${lawyerData.name} salvo com sucesso.`);
  }

  mongoose.connection.close();
};

seedLawyers();
