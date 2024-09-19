import User from '../models/User.js';
import argon2 from 'argon2';

// Criar um novo usuário
const createUser = async (req, res) => {
  try {
    const { name, role, password } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: 'Usuário já cadastrado' });

    // Hash da senha
    const hashedPassword = await argon2.hash(password);

    // Criar um novo usuário
    const user = new User({ name, role, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar um usuário pelo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar um usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    if (password) {
      user.password = await argon2.hash(password);
    }
    if (name) {
      user.name = name;
    }
    if (role) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Excluir um usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
