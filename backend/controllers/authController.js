import User from '../models/User.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Registro de usuário
const registerUser = async (req, res) => {
  try {
    const { name, role, password } = req.body;
    
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ name });
    if (existingUser) return res.status(400).json({ message: 'Usuário já cadastrado' });

    // Hash da senha com argon2
    const hashedPassword = await argon2.hash(password);

    // Criar um novo usuário
    const user = new User({ name, role, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login do usuário
const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Verificar a senha com argon2
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    // Gerar um token JWT
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userObject = user.toObject();

    const { password: _, ...userRes } = userObject;

    res.json({ user: userRes, token, message:"Login realizado com sucesso"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export default {
  register: registerUser,
  login: loginUser
};
