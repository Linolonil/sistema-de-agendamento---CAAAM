import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import  {
  changeRoom,
  confirmScheduleNow,
  createNewSchedule,
  createUserLawyer,
  deleteScheduleById,
  fetchAllRooms,
  fetchAllSchedules,
  getLawyer,
} from "../services/apiSchedules.js";

export const ScheduleContext = createContext();

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Adiciona 0 se necessário
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;
  return { date };
};

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [tipoAgendamento, setTipoAgendamento] = useState("meeting");
  const [userId, setUserId] = useState(null);
  const [horario, setHorario] = useState("08:00");
  const [date, setDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [oab, setOab] = useState("");
  const [lawyer, setLawyer] = useState(null);
  const [lawyerName, setLawyerName] = useState("");
  const [tempOab, setTempOab] = useState("");
  const [telefone, setTelefone] = useState("");
  const [lawyerFound, setLawyerFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate().date);
  // useEffect para buscar user no localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem("@Auth:user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser)._id);
    }
  }, []);

  // useEffect pra iniciar as salas
  useEffect(() => {
    fetchRooms();
  }, []);

  // userEffect inicial para buscar com a data atual
  useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);

  // busca agendamentos
  const fetchSchedules = async (date) => {
    const token = localStorage.getItem("@Auth:token");
    setLoading(true);
    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }
    try {
      const response = await fetchAllSchedules(date, token);
      const { schedules } = response;
      const updatedSchedules = schedules.flatMap(schedule => {
        const { time, type } = schedule;
        const newTime = Number(time.split(":")[0]); 
    
        if (type === 'hearing') {
          let originHour = time
            return [
                { ...schedule,originHour, time }, 
                { ...schedule,originHour, time: `${String(newTime + 1).padStart(2, '0')}:00` }, 
                { ...schedule,originHour, time: `${String(newTime + 2).padStart(2, '0')}:00` },
            ];
        }
    
        return schedule;
    });
    
      setSchedules(updatedSchedules);
      setError(null);
      return;
    } catch (error) {
      console.log(error);
      setError("Erro ao buscar os dados.");
    } finally {
      setLoading(false);
    }
};


  // busca salas
  const fetchRooms = async () => {
    const token = localStorage.getItem("@Auth:token");
    setLoading(true);
    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const response = await fetchAllRooms(token);
      const { rooms } = response;

      setRooms(rooms);
      setError(null);
      return;
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar os dados das salas.");
      return;
    } finally {
      setLoading(false);
    }
  };

  // busca o advogado pelo oab
  const getLawyerByOab = async (oab) => {
    if (!oab) {
      setError("O OAB não pode ser vazio!");
      return;
    }
    try {
      const response = await getLawyer(oab);
      if (!response || !response.lawyer) {
        setError("Dados do advogado não encontrados.");
        return;
      }
      return response;
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Erro ao buscar o advogado.");
      return null;
    }
  };

  // cria novo advogado
  const createLawyer = async (name, oab, phoneNumber) => {
    if (!name || !oab || !phoneNumber) {
      setError("Preencha todos os campos!");
      return;
    }
    try {
      const response = await createUserLawyer(name, oab, phoneNumber);
      return response;
    } catch (error) {
      console.error(error);
      setError(error.response?.data || "Erro ao criar advogado!");
      return null;
    }
  };

  // cria novo agendamento
  const createSchedule = async ({
    date,
    hour,
    roomId,
    lawyerId,
    userId,
    type,
  }) => {
    setLoading(true);
    const cleanValues = () => {
      setLawyerFound("");
      setOab("");
      setTempOab("");
      setTelefone("");
    };
  
    const token = localStorage.getItem("@Auth:token");
  
    try {
      const response = await createNewSchedule({
        roomId,
        lawyerId,
        userId,
        date,
        time: hour,
        type,
        token
      });
  
  
      if (response?.success) {
        await fetchSchedules(selectedDate);
        cleanValues();
        return response;
      } else {
        setError("Erro ao criar agendamento!");
      }
    } catch (error) {
      console.error("Erro:", error);
      setError(error.response?.data || "Erro ao criar agendamento!");
      return error.data
    } finally {
      setLoading(false);
    }
  };
  

  // Função para o usuário atualizar a data
  const updateDate = (newDate) => {
    setSelectedDate(newDate);
  };

  // Função para confirmar um agendamento
  const confirmSchedule = async (scheduleId) => {
    const token = localStorage.getItem("@Auth:token");
    setLoading(true);
    if (!scheduleId || scheduleId === undefined) {
      setError("Sala indisponível!");
      setLoading(false);
      return;
    }

    try {
      await confirmScheduleNow(scheduleId, token);
      
      await fetchSchedules(selectedDate);
      
      return true;
    } catch (error) {
      setError(error.response?.data || "Erro ao confirmar agendamento!");
    }finally {
      setLoading(false);
  }
};

  // função pra mudar o estado da sala, se tem ar, tv
  const changeRoomState = async (
    roomId,
    hasAirConditioning,
    hasTV,
    hasComputer
  ) => {
    setLoading(true);
    try {
      const  status  = await changeRoom(roomId, {
        hasAirConditioning,
        hasTV,
        hasComputer,
      });
  
      if (status !== 200) {
        setError("Erro ao atualizar a sala!");
        return;
      }
  
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === roomId
            ? { ...room, hasAirConditioning, hasTV, hasComputer }
            : room
        )
      );
  
      await fetchSchedules(selectedDate);
    } catch (error) {
      setError(error.response?.data || "Erro ao atualizar a sala!");
    } finally {
      setLoading(false);
    }
  };
  
  // exclui um agendamento
  const deleteSchedule = async (scheduleId) => {
    setLoading(true);
    if (!scheduleId || scheduleId === undefined) {
      setError("Id do agendamento não pode ser encontrado!");
      setLoading(false);
      return;
    }
    try {
      const response = await deleteScheduleById(scheduleId);
      if (response.status === 200) {
        fetchSchedules(selectedDate);
        return
      } else {
        setError("Erro ao excluir agendamento!");
        setLoading(false);
        return;
      }
    } catch (error) {
      setError(error.response?.data || "Erro ao excluir agendamento!");
    }finally {
      setLoading(false);
  }};

  // valores do contexto
  const value = {
    lawyer,
    roomId,
    userId,
    date,
    oab,
    setOab,
    horario,
    deleteSchedule,
    setHorario,
    fetchRooms,
    rooms,
    tipoAgendamento,
    changeRoomState,
    createSchedule,
    createLawyer,
    confirmSchedule,
    getLawyerByOab,
    schedules,
    loading,
    error,
    selectedDate,
    updateDate,
    lawyerName,
    tempOab,
    telefone,
    lawyerFound,
    setRoomId,
    setLawyer,
    setUserId,
    setDate,
    setTipoAgendamento,
    setLawyerName,
    setTempOab,
    setTelefone,
    setLawyerFound,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

ScheduleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScheduleContext;
