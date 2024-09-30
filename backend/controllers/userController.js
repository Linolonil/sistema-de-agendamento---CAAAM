import User from '../models/User.js';
import argon2 from 'argon2';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// Criar um novo usuário
const createUser = async (req, res) => {
  try {
    const { name, role, password, userName } = req.body;

    // Verificar campos obrigatórios
    if (!name || !userName || !password || !role) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se o nome de usuário já existe
    const existingUser = await User.findOne({ userName: userName.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await argon2.hash(password);

    // Verificar se uma imagem foi enviada
    let image_filename = '';
    if (req.file) {
      image_filename = req.file.filename;
    }

    // Criar um novo usuário
    const user = new User({ 
      name, 
      userName: userName.toLowerCase(), 
      role, 
      password: hashedPassword, 
      iconProfile: image_filename || '' // Se não tiver imagem, salvar string vazia
    });
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
    const { name, role, password, userName } = req.body;

    if (!id) return res.status(400).json({ message: 'ID é obrigatório' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Se uma nova imagem foi enviada
    if (req.file) {
      // Se a imagem atual for diferente da nova
      if (user.iconProfile && user.iconProfile !== req.file.filename) {
        // Remove a imagem antiga
        fs.unlink(`uploads/${user.iconProfile}`, (err) => {
          if (err) console.error(err);
        });
      }

      // Atualiza a imagem do perfil com a nova
      user.iconProfile = req.file.filename; 
    }

    // Atualizar apenas os campos que foram passados
    if (password) {
      user.password = await argon2.hash(password);
    }
    if (name) {
      user.name = name;
    }
    if (role) {
      user.role = role;
    }
    if (userName) {
      const existingUserName = await User.findOne({ userName: userName.toLowerCase() });
      if (existingUserName && existingUserName._id.toString() !== id) {
        return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
      }
      user.userName = userName.toLowerCase();
    }

    await user.save();
    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    console.error(error); // Log do erro
    res.status(500).json({ message: error.message });
  }
};


// Excluir um usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.body.id);
    fs.unlink(`uploads/${user.iconProfile}`, ()=>{})

    await User.findByIdAndDelete(id);

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
