import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";

// Criar um novo agendamento
const createSchedule = async (req, res) => {
  try {
    const { roomId, lawyerId, userId, date, time, type } = req.body;

    // Convert time to a JavaScript Date object for easier comparison
    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const isFriday = new Date(date).getDay() === 5; // 5 é o código para sexta-feira
    // Verificar se o horário é inteiro e dentro do intervalo permitido
    if (minute !== 0 || hour < 8 || hour > (isFriday ? 17 : 18)) {
      return res.status(400).json({
        message: `Horário inválido. O horário deve ser inteiro e dentro do intervalo de ${isFriday ? '08:00 - 17:00' : '08:00 - 18:00'}.`,
      });
    }

    // Verificar se a sala está disponível
    const existingSchedule = await Schedule.findOne({
      roomId,
      date,
      time,
    });

    if (existingSchedule) {
      return res.status(400).json({ message: 'Sala já está ocupada neste horário' });
    }

    // Verificar se o advogado existe
    const lawyerExists = await Lawyer.findById(lawyerId);
    if (!lawyerExists) return res.status(404).json({ message: 'Advogado não encontrado' });

    // Verificar se o usuário existe
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Criar um novo agendamento
    const schedule = new Schedule({ roomId, userId, lawyerId, date, time, type });
    await schedule.save();

    res.status(201).json({ message: 'Agendamento criado com sucesso', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Listar todos os agendamentos

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("roomId")
      .populate("lawyerId")
      .populate("userId");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar um agendamento pelo ID
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("roomId")
      .populate("lawyerId")
      .populate("userId");
    if (!schedule)
      return res.status(404).json({ message: "Agendamento não encontrado" });

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
    if (!schedule)
      return res.status(404).json({ message: "Agendamento não encontrado" });

    schedule.confirmed = isConfirmed;
    await schedule.save();

    res
      .status(200)
      .json({ message: "Agendamento atualizado com sucesso", schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  confirmSchedule,
};
