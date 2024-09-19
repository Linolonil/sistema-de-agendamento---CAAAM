import express from 'express';
import Lawyer from '../models/Lawyer.js';  // Usaremos o modelo de usuário para advogados

const router = express.Router();

// Criar um novo advogado
router.post('/', async (req, res) => {
  try {
    const { name, oab, phoneNumber } = req.body;

    // Verificar se o advogado já existe
    const existingLawyer = await Lawyer.findOne({ name });
    if (existingLawyer) return res.status(400).json({ message: 'Advogado já cadastrado' });

    // Criar um novo advogado
    const lawyer = new User({ name, role: 'Lawyer', oab, phoneNumber });
    await lawyer.save();

    res.status(201).json({ message: 'Advogado criado com sucesso', lawyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar todos os advogados
router.get('/', async (req, res) => {
  try {
    const lawyers = await Lawyer.find({ role: 'Lawyer' });
    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar um advogado pelo ID
router.get('/:id', async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ message: 'Advogado não encontrado' });

    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
