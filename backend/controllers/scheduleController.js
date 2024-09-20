import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import { parseISO, getDay,startOfDay, endOfDay, isValid } from 'date-fns';


// Criar um novo agendamento
const createSchedule = async (req, res) => {
  try {
    const { roomId, lawyerId, userId, date, time, type } = req.body;

    const parsedDate = parseISO(date);

    // Verificar se a data cai entre segunda e sexta-feira
    const dayOfWeek = getDay(parsedDate);
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 é domingo, 6 é sábado
      return res.status(400).json({
        message: 'Agendamentos só podem ser feitos de segunda a sexta-feira.',
      });
    }

    // Definir a duração com base no tipo de agendamento
    const duration = type === 'hearing' ? 3 : 1;

    // Converter o horário de início para objeto Date
    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const isFriday = dayOfWeek === 5; // Verificar se é sexta-feira

    // Verificar se o horário é válido
    if (minute !== 0 || hour < 8 || hour > (isFriday ? 17 : 18)) {
      return res.status(400).json({
        message: `Horário inválido. O horário deve ser inteiro e dentro do intervalo de ${isFriday ? '08:00 - 17:00' : '08:00 - 18:00'}.`,
      });
    }

    // Calcular o horário de término
    const endHour = hour + duration;

    // Verificar se o horário de término é válido
    if (endHour > (isFriday ? 17 : 18)) {
      return res.status(400).json({
        message: `A reunião/audiência ultrapassa o horário permitido de ${isFriday ? '17:00' : '18:00'}.`,
      });
    }

    // Verificar se a sala está disponível durante o período
    const conflictingSchedule = await Schedule.findOne({
      roomId,
      date,
      $or: [
        { time: { $gte: time, $lt: `${endHour}:00` } }, // Agendamento inicia durante o período
        { endTime: { $gt: time, $lte: `${endHour}:00` } }, // Agendamento termina dentro do período
        { time: { $lt: `${endHour}:00` }, endTime: { $gt: time } } // Agendamento se sobrepõe ao novo
      ],
    });

    if (conflictingSchedule) {
      return res.status(400).json({ message: 'Sala já está ocupada durante este horário' });
    }

    // Verificar se o advogado existe
    const lawyerExists = await Lawyer.findById(lawyerId);
    if (!lawyerExists) return res.status(404).json({ message: 'Advogado não encontrado' });

    // Verificar se o usuário existe
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: 'Usuário não encontrado' });

    if (type === 'hearing') {
      // Criar múltiplos agendamentos para audiências
      const schedulesToSave = [];
      for (let i = 0; i < 3; i++) {
        const hearingTime = `${hour + i}:00`; // Horários escalonados
        const hearingEndHour = hour + 3; // Termina em 3 horas

        const schedule = new Schedule({
          roomId,
          userId,
          lawyerId,
          date,
          time: hearingTime,
          endTime: `${hearingEndHour}:00`, // Definindo o horário de término
          type: 'hearing',
        });

        schedulesToSave.push(schedule);
      }

      // Salvar todos os agendamentos no banco
      await Schedule.insertMany(schedulesToSave);
    } else {
      // Criar um novo agendamento se não for audiência
      const schedule = new Schedule({
        roomId,
        userId,
        lawyerId,
        date,
        time,
        endTime: `${endHour}:00`, // Definindo o horário de término
        type,
      });

      await schedule.save();
    }

    res.status(201).json({ message: 'Agendamento criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Listar todos os agendamentos
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
const getSchedulesByDay = async (req, res) => {
  try {
    const { date } = req.query; // Obter a data da query param
    if (!date) {
      return res.status(400).json({ message: 'Por favor, forneça uma data válida.' });
    }

    const parsedDate = parseISO(date);
    
    // Verificar se a data é válida
    if (!isValid(parsedDate)) {
      return res.status(400).json({ message: 'Data inválida. Use o formato YYYY-MM-DD.' });
    }

    // Obter o início e fim do dia para a data fornecida
    const start = startOfDay(new Date(date));
    const end = endOfDay(new Date(date));
        
    // Buscar agendamentos entre o início e fim do dia
    const schedules = await Schedule.find({
      date: {
        $gte: start,
        $lt: end,
      },
    })
    .populate("roomId")
    .populate("lawyerId")
    .populate("userId");

    if (schedules.length === 0) {
      return res.status(404).json({
        message: 'Nenhum agendamento encontrado para essa data.',
        availableRooms: [], // Aqui você pode adicionar lógica para retornar as salas disponíveis, se necessário
      });
    }

    res.status(200).json(schedules);
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
  getSchedulesByDay,
  deleteAllSchedules,
  deleteSchedules,
  getScheduleById,
  confirmSchedule,
};
