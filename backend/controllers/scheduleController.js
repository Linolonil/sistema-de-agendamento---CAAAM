import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import { parseISO, isWeekend,isBefore ,isValid, hoursToSeconds } from 'date-fns';
import Room from "../models/Room.js";

const checkConflictingSchedules = async (parsedDate, hour, duration, roomId) => {
  const conflictingSchedules = [];
  for (let i = 0; i < duration; i++) {
    const scheduleTime = `${hour + i}:00`;
    const conflictingSchedule = await Schedule.findOne({
      date: parsedDate,
      time: scheduleTime, 
      roomId,
    });
    if (conflictingSchedule) {
      conflictingSchedules.push(conflictingSchedule);
    }
  }
  return conflictingSchedules;
};

const createSchedule = async (req, res) => {
  try {
    const { roomId, lawyerId, userId, date, time, type } = req.body;

    const parsedDate = parseISO(date);

    // Verificar a disponibilidade da sala
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: 'A sala não está disponível para agendamento.' });
    }

    // Verificar se o dia é válido
    if (isWeekend(parsedDate)) {
      return res.status(400).json({ message: 'Agendamentos só podem ser feitos de segunda a sexta-feira.' });
    }



    // Obtém o advogado e o usuário
    const lawyer = await Lawyer.findById(lawyerId);
    const user = await User.findById(userId);

    if (!lawyer || !user) {
      return res.status(404).json({ message: 'Usuário ou advogado não encontrado' });
    }

    // Duração da audiência ou reunião
    const duration = type === 'hearing' ? 3 : 1; // 3 horas para audiência, 1 hora para reunião

    // converter hora em timestamp
    const [hour, minute] = time.split(':').map(Number);
    const startTime = new Date(parsedDate);
    startTime.setHours(hour, minute, 0, 0);

    // Verificar conflitos de agendamento
    const conflictingSchedules = await checkConflictingSchedules(parsedDate, hour, duration, roomId);
    
    if (conflictingSchedules.length > 0) {
      return res.status(400).json({ message: 'Um ou mais horários estão ocupados.' });
    }

    // Salvar novos agendamentos
    for (let i = 0; i < duration; i++) {
      const scheduleTime = `${hour + i}:00`;
      const scheduleData = {
        date: parsedDate,
        time: scheduleTime,
        userId,
        lawyerId,
        roomId,
        type,
        duration,
      };

      const newSchedule = new Schedule(scheduleData);
      await newSchedule.save();
    }

    // Enviar a resposta de sucesso
    res.status(201).json({ success: true ,message: type === 'hearing' ? 'Audiência criada com sucesso' : 'Reunião criada com sucesso' });
    
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};

const getAllSchedules = async (req, res) => {
  const user = req.user; 
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

// deletar todos os agendamentos 
const deleteAllSchedules = async (req, res) => {
  try {
    await Schedule.deleteMany({});
    res.status(200).json({ message: 'Todos os agendamentos foram deletados com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deletar agendamento 
const deleteSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.deleteMany({ _id: id });
    res.status(200).json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar agendamentos de um dia
const getSchedulesByDayAndHour = async (req, res) => {
  try {
    const { date, hour } = req.params; // Obter data e hora da query param
    if (!date || !hour) {
      return res.status(400).json({ message: 'Por favor, forneça uma data e uma hora válidas.' });
    }

    const parsedDate = parseISO(date);
    // Verificar se a data é válida
    if (!isValid(parsedDate)) {
      return res.status(400).json({ message: 'Data inválida. Use o formato YYYY-MM-DD.' });
    }

    // Buscar agendamentos para a data e hora especificadas
    const schedules = await Schedule.find({
      date: parsedDate,
      time: hour,
    })
      .populate({
        path: 'roomId',
        select: 'number hasAirConditioning hasTV hasComputer capacity',
      })
      .populate({
        path: 'lawyerId',
        select: 'name oab phone',
      })
      .populate({
        path: 'userId',
        select: 'name',
      });

    // Obter IDs das salas ocupadas
    const occupiedRoomNumbers = schedules.map(schedule => schedule.roomId.number);

    // Obter todas as salas disponíveis
    const rooms = await Room.find({ isAvailable: true });

    // Comparar as salas e retornar os números que não estão ocupados
    const desocupiedRoomNumbers = rooms
      .filter(room => !occupiedRoomNumbers.includes(room.number))
      .map(room => ({
        _id: room._id,
        number: room.number,
        hasAirConditioning: room.hasAirConditioning,
        hasComputer: room.hasComputer,
        hasTV: room.hasTV,
        capacity: room.capacity,
      }));

    // Retornar os agendamentos encontrados e as salas ocupadas e desocupadas
    res.status(200).json({
      schedules,
      occupiedRoomNumbers,
      desocupiedRoomNumbers,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Confirmar um agendamento
const confirmSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);
    if (!schedule)
      return res.status(404).json({ message: "Agendamento não encontrado" });


    schedule.confirmed === true ? schedule.confirmed = false : schedule.confirmed = true;
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
  getSchedulesByDayAndHour,
  deleteAllSchedules,
  deleteSchedules,
  getScheduleById,
  confirmSchedule,
};
