import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

// Criar um novo agendamento
const createSchedule = async (req, res) => {
  try {
    const { room, lawyer, startTime, endTime, type } = req.body;

    // Verificar se a sala está disponível
    const existingSchedule = await Schedule.findOne({
      room,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (existingSchedule) {
      return res.status(400).json({ message: 'Sala já está ocupada neste horário' });
    }

    // Verificar se o advogado existe
    const lawyerExists = await User.findById(lawyer);
    if (!lawyerExists) return res.status(404).json({ message: 'Advogado não encontrado' });

    // Criar um novo agendamento
    const schedule = new Schedule({ room, lawyer, startTime, endTime, type });
    await schedule.save();

    res.status(201).json({ message: 'Agendamento criado com sucesso', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todos os agendamentos
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('room').populate('lawyer');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar um agendamento pelo ID
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('room').populate('lawyer');
    if (!schedule) return res.status(404).json({ message: 'Agendamento não encontrado' });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirmar um agendamento
const confirmSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConfirmed } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ message: 'Agendamento não encontrado' });

    schedule.isConfirmed = isConfirmed;
    await schedule.save();

    res.status(200).json({ message: 'Agendamento atualizado com sucesso', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  confirmSchedule
};
