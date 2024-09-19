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
    // verifica o telefone
    if(phoneNumber === '' || phoneNumber === undefined){
      phoneNumber= '00000000000';
    }
    // Criar um novo advogado
    const lawyer = new Lawyer({ name, role: 'Lawyer', oab, phoneNumber });
    await lawyer.save();

    res.status(201).json({ message: 'Advogado criado com sucesso', lawyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar todos os advogados
router.get('/', async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// atualizar um advogado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, oab, phoneNumber } = req.body;

    // Busca o advogado pelo ID
    const lawyer = await Lawyer.findById(id);
    if (!lawyer) {
      return res.status(404).json({ message: 'Advogado não encontrado' });
    }

    lawyer.name = name !== undefined ? name : lawyer.name;
    lawyer.oab = oab !== undefined ? oab : lawyer.oab;
    lawyer.phoneNumber = phoneNumber !== undefined ? phoneNumber : lawyer.phoneNumber;


    // Salva as mudanças no banco de dados
    await lawyer.save();

    res.status(200).json({ message: 'Advogado atualizado com sucesso', lawyer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Excluir um advogado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o advogado pelo ID
    const lawyer = await Lawyer.findByIdAndDelete(id);
    if (!lawyer) {
      return res.status(404).json({ message: 'Advogado não encontrado' });
    }

    res.status(200).json({ message: 'Advogado excluído com sucesso' });
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
