import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado com sucesso ao MongoDB');
  } catch (error) {
    console.error('Não foi possível conectar ao MongoDB:', error);
    process.exit(1); // Encerra o processo em caso de erro de conexão
  }
};

export default connectDB;
