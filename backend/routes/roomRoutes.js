import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Criar uma nova sala
router.post('/', async (req, res) => {
  try {
    const { number, hasAirConditioning, hasTV, capacity } = req.body;

    // Verificar se a sala já existe
    const existingRoom = await Room.findOne({ number });
    if (existingRoom) return res.status(400).json({ message: 'Sala já cadastrada' });

    // Criar a nova sala com as informações completas
    const room = new Room({ number, hasAirConditioning, hasTV, capacity });
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

// Atualizar as informações de uma sala
router.put('/:id', async (req, res) => {
  try {
    const { number, hasAirConditioning, hasTV, capacity } = req.body;

    // Buscar a sala pelo ID
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Sala não encontrada' });

    // Atualizar os campos se houver mudanças
    room.number = number !== undefined ? number : room.number;
    room.hasAirConditioning = hasAirConditioning !== undefined ? hasAirConditioning : room.hasAirConditioning;
    room.hasTV = hasTV !== undefined ? hasTV : room.hasTV;
    room.capacity = capacity !== undefined ? capacity : room.capacity;

    await room.save();

    res.status(200).json({ message: 'Sala atualizada com sucesso', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deletar uma sala
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Sala não encontrada' });

    await room.deleteOne();

    res.status(200).json({ message: 'Sala excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// deleta todas as salas
router.delete('/', async (req, res) => {
  try {
    await Room.deleteMany();

    res.status(200).json({ message: 'Todas as salas foram deletadas com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
