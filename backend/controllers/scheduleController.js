import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";
import {
  isValid,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  parseISO,
  isWeekend,
  addHours,
} from "date-fns";

import Room from "../models/Room.js";

const checkConflictingSchedules = async (
  parsedDate,
  hour,
  duration,
  roomId
) => {
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
// antigo
const createSchedule = async (req, res) => {
  try {
    const { roomId, lawyerId, userId, date, time, type } = req.body;

    const parsedDate = parseISO(date);

    // Verificar a disponibilidade da sala
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res
        .status(400)
        .json({ message: "A sala não está disponível para agendamento." });
    }

    // Verificar se o dia é válido
    if (isWeekend(parsedDate)) {
      return res.status(400).json({
        message: "Agendamentos só podem ser feitos de segunda a sexta-feira.",
      });
    }

    // Obtém o advogado e o usuário
    const lawyer = await Lawyer.findById(lawyerId);
    const user = await User.findById(userId);

    if (!lawyer || !user) {
      return res
        .status(404)
        .json({ message: "Usuário ou advogado não encontrado" });
    }

    // Duração da audiência ou reunião
    const duration = type === "hearing" ? 3 : 1; // 3 horas para audiência, 1 hora para reunião

    // converter hora em timestamp
    const [hour, minute] = time.split(":").map(Number);
    const startTime = new Date(parsedDate);
    startTime.setHours(hour, minute, 0, 0);

    // Verificar conflitos de agendamento
    const conflictingSchedules = await checkConflictingSchedules(
      parsedDate,
      hour,
      duration,
      roomId
    );

    if (conflictingSchedules.length > 0) {
      return res
        .status(400)
        .json({ message: "Um ou mais horários estão ocupados." });
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
    res.status(201).json({
      success: true,
      message:
        type === "hearing"
          ? "Audiência criada com sucesso"
          : "Reunião criada com sucesso",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// novo controller pra criar agendamentos (FUNCIONAL!)
const newCreateSchedule = async (req, res) => {
  try {
    const { roomId, lawyerId, userId, date, time, type } = req.body;

    const parsedDate = parseISO(date);

    // Verificar se o dia é válido (segunda a sexta)
    if (isWeekend(parsedDate)) {
      return res.status(400).json({
        success: false,

        message: "Agendamentos só podem ser feitos de segunda a sexta-feira.",
      });
    }

    // Verificar a disponibilidade da sala
    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A sala não está disponível para agendamento.",
        });
    }

    // Obter o advogado e o usuário
    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) {
      return res
        .status(404)
        .json({ success: false, message: "Advogado não encontrado" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado" });
    }

    // Definir a duração com base no tipo
    const duration = type === "hearing" ? 3 : 1; // 3 horas para 'hearing', 1 hora para 'meeting'

    // Converter a hora em um objeto Date
    const [hour, minute] = time.split(":").map(Number);
    const startTime = new Date(parsedDate);
    startTime.setHours(hour, minute, 0, 0);

    // Calcular o horário de término
    const endTime = addHours(startTime, duration);

    // Verificar conflitos de agendamento
    const conflictingSchedules = await Schedule.find({
      roomId,
      date: parsedDate,
      $or: [
        {
          // Horários que começam antes do fim do novo agendamento
          time: { $lt: endTime.toTimeString().slice(0, 5) },
          endTime: { $gt: startTime.toTimeString().slice(0, 5) },
        },
        {
          // Horários que terminam depois do início do novo agendamento
          endTime: { $gt: startTime.toTimeString().slice(0, 5) },
          time: { $lt: endTime.toTimeString().slice(0, 5) },
        },
      ],
    });

    if (conflictingSchedules.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Conflito de horário: a sala está ocupada no horário solicitado.",
      });
    }

    // Dados do agendamento
    const scheduleData = {
      date: parsedDate,
      time: time,
      endTime: endTime.toTimeString().slice(0, 5),
      userId,
      lawyerId,
      roomId,
      type,
    };

    // Salvar o novo agendamento
    const newSchedule = new Schedule(scheduleData);
    await newSchedule.save();

    // Enviar a resposta de sucesso
    res.status(201).json({
      success: true,
      message:
        type === "hearing"
          ? "Audiência criada com sucesso"
          : "Reunião criada com sucesso",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function getNextTwoHours(startTime) {
  const timeBlocks = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const startIndex = timeBlocks.indexOf(startTime);
  return timeBlocks.slice(startIndex + 1, startIndex + 3); // Retorna os próximos dois horários
}

const getAllSchedules = async (req, res) => {
  const { date, time } = req.params; // Obter data e hora da query param

  if (!date || !time) {
    return res
      .status(400)
      .json({ message: "Por favor, forneça uma data e hora válidas!" });
  }

  const parsedDate = parseISO(date);
  // Verificar se a data é válida
  if (!isValid(parsedDate)) {
    return res
      .status(400)
      .json({ message: "Data inválida. Use o formato YYYY-MM-DD." });
  }

  try {
    // Buscar todos os agendamentos para o dia inteiro
    const schedules = await Schedule.find({
      date: {
        $gte: startOfDay(parsedDate),
        $lt: endOfDay(parsedDate),
      },
    }).populate("roomId");

    // Obter IDs das salas ocupadas para cada horário
    const occupiedRoomsByHour = {};
    schedules.forEach((schedule) => {
      const hour = schedule.time; // hora do agendamento (assumindo que `time` é a hora do agendamento)
      if (!occupiedRoomsByHour[hour]) {
        occupiedRoomsByHour[hour] = [];
      }
      occupiedRoomsByHour[hour].push(schedule.roomId.number);
    });

    // Obter todas as salas
    const allRooms = await Room.find({ isAvailable: true });

    // Listar as salas ocupadas
    const occupiedRooms = schedules.map((schedule) => schedule.roomId.number);

    // Criar um array com os horários consecutivos a partir da hora fornecida
    const startTime = time; // Exemplo: '09:00'
    const nextTwoHours = getNextTwoHours(startTime); // Função que retorna os próximos dois horários consecutivos, como ['10:00', '11:00']

    // Identificar salas disponíveis para 3 horas consecutivas (para audiências)
    const freeRoomsForAudience = allRooms.filter((room) => {
      const roomNumber = room.number;
      // Checar se a sala está disponível nos 3 horários consecutivos (inicial e os próximos 2)
      const isAvailableForThreeHours = [startTime, ...nextTwoHours].every(
        (hour) => {
          return (
            !occupiedRoomsByHour[hour] ||
            !occupiedRoomsByHour[hour].includes(roomNumber)
          );
        }
      );
      return isAvailableForThreeHours;
    });

    // Retornar as informações das salas ocupadas e livres para audiência
    res.status(200).json({
      freeRoomsForAudience,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

const deleteSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.deleteMany({ _id: id });
    res.status(200).json({ message: "Agendamento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchedulesByDayAndHour = async (req, res) => {
  try {
    const { date } = req.params; // Obter data e hora da query param
    if (!date) {
      return res
        .status(400)
        .json({ message: "Por favor, forneça uma data e uma hora válidas." });
    }

    const parsedDate = parseISO(date);
    // Verificar se a data é válida
    if (!isValid(parsedDate)) {
      return res
        .status(400)
        .json({ message: "Data inválida. Use o formato YYYY-MM-DD." });
    }

    // Buscar agendamentos para a data e hora especificadas
    const schedules = await Schedule.find({
      date: parsedDate,
    })
      .populate({
        path: "roomId",
        select: "number capacity",
      })
      .populate({
        path: "lawyerId",
        select: "name oab phoneNumber",
      })
      .populate({
        path: "userId",
        select: "name",
      });
    res.status(200).json({
      schedules,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);
    if (!schedule)
      return res.status(404).json({ message: "Agendamento não encontrado" });

    schedule.confirmed === true
      ? (schedule.confirmed = false)
      : (schedule.confirmed = true);
    await schedule.save();

    res
      .status(200)
      .json({ message: "Agendamento atualizado com sucesso", schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  const { idUser } = req.body;

  try {
    // Definir o mês atual
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    // Contar o total de advogados
    const totalAdvogadosCadastrados = await Lawyer.countDocuments();

    // Contar o total de reuniões
    const totalMeetings = await Schedule.countDocuments({ type: "meeting" });

    // Contar o total de audiências
    const totalHearings = await Schedule.countDocuments({ type: "hearing" });

    // Calcular o total de agendamentos como a soma de reuniões e audiências ajustadas
    const totalAgendamentos = totalMeetings + totalHearings;

    // Contar agendamentos do usuário específico
    const totalScheduleFromUser = await Schedule.countDocuments({
      userId: idUser,
    });

    // Buscar total de agendamentos por mês
    const monthlyAgendamentos = await Schedule.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Ordenar por ano e mês
      },
    ]);

    // Retornar os resultados
    res.status(200).json({
      totalAgendamentos,
      totalAdvogadosCadastrados,
      totalMeetings,
      totalHearings,
      totalScheduleFromUser,
      monthlyAgendamentos,
    });
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar os dados", error: error.message });
  }
};

export default {
  createSchedule,
  newCreateSchedule,
  getAll,
  getAllSchedules,
  getSchedulesByDayAndHour,
  deleteSchedules,
  getScheduleById,
  confirmSchedule,
};
