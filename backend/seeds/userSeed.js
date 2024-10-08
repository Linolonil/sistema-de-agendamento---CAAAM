import mongoose from 'mongoose';
import User from '../models/User.js';
import argon2 from 'argon2';
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
const seedUsers = async () => {
  await connectDB();

  // Dados de exemplo
  const users = [
    { name: 'Thiago', role: 'admin', password: 'admin123' },  // Efetivado
    { name: 'Ana Tereza', role: 'admin', password: 'admin123' },  // Efetivado
    { name: 'Eloisa', role: 'intern', password: 'intern123' },  // Estagiário
    { name: 'Alice', role: 'intern', password: 'intern123' },  // Estagiário
    { name: 'Lino', role: 'intern', password: 'intern123' },  // Estagiário
  ];

  for (const userData of users) {
    const hashedPassword = await argon2.hash(userData.password);
    const user = new User({
      name: userData.name,
      role: userData.role,
      password: hashedPassword,
    });
    await user.save();
    console.log(`Usuário ${userData.name} salvo com sucesso.`);
  }

  mongoose.connection.close();
};

seedUsers();
