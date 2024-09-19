import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Criar uma nova sala
router.post('/', async (req, res) => {
  try {
    const { number } = req.body;

    // Verificar se a sala já existe
    const existingRoom = await Room.findOne({ number });
    if (existingRoom) return res.status(400).json({ message: 'Sala já cadastrada' });

    // Criar a nova sala
    const room = new Room({ number });
    await room.save();

    res.status(201).json({ message: 'Sala criada com sucesso', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Listar todas as salas
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buscar uma sala pelo ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Sala não encontrada' });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
