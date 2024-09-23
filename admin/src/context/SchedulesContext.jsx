import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const ScheduleContext = createContext();

const getCurrentDateAndHour = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona 0 se necessário
  const day = String(now.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;
   return { date , hour: `8:00` };
};


export const ScheduleProvider = ({ children }) => {
  // Estados para salas e agendamentos
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para armazenar data e hora
  const [selectedDate, setSelectedDate] = useState(getCurrentDateAndHour().date);
  const [selectedHour, setSelectedHour] = useState(getCurrentDateAndHour().hour);
  // Função para buscar os agendamentos com base na data e hora
  
  const fetchSchedulesAndRooms = async (date, hour) => {
    setLoading(true);
    try {
      const response = await api.get(`api/v1/schedules/schedules/day/${date}/${hour}`);
      const { schedules, desocupiedRoomNumbers, occupiedRoomNumbers } = response.data;
      setSchedules(schedules);
      setAvailableRooms(desocupiedRoomNumbers);
      setOccupiedRooms(occupiedRoomNumbers);
      setError(null); // Limpa qualquer erro anterior
    } catch (error) {
      console.log(error);
      setError('Erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect inicial para buscar com a data e hora atuais
  useEffect(() => {
    fetchSchedulesAndRooms(selectedDate, selectedHour);
  }, [selectedDate, selectedHour]);

  // busca o advogado pelo oab
  const getLawyerByOab = async (oab) => {
    try {
      const response = await api.get(`/api/v1/lawyer/lawyer/${oab}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };
  // cria novo advogado
  const createLawyer = async (name, oab, phoneNumber) => {
    try {
      const response = await api.post(`/api/v1/lawyer`, { name, oab, phoneNumber });
      console.log(response)
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };
  // cria novo agendamento
  const createSchedule = async (date, hour, roomId, lawyerId, userId, type) => {
    try {
      const response = await api.post(`api/v1/schedules`, {
        roomId,
        lawyerId,
        userId,
        date,
        time:hour,
        type
      });
      if (response.status === 201) {
        toast.success("Agendamento criado com sucesso!");
        fetchSchedulesAndRooms(selectedDate, selectedHour);
      } else {
        toast.error("Erro ao criar agendamento!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar agendamento!");
      return error.response.data;
    }
  };

  // Função para o usuário atualizar a data e hora
  const updateDateAndHour = (newDate, newHour) => {
    setSelectedDate(newDate);
    setSelectedHour(newHour);
  };

  // Função para confirmar um agendamento
  const confirmSchedule = async (scheduleId) => {
    if(!scheduleId || scheduleId === undefined) return toast.info("Sala disponível!");

    try {
      const response = await api.patch(`api/v1/schedules/${scheduleId}/confirm`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchSchedulesAndRooms(selectedDate, selectedHour);
      } else {
        toast.error("Erro ao confirmar agendamento!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao confirmar agendamento!");
    }
  }
  const value = {
    occupiedRooms,
    availableRooms,
    createSchedule,
    createLawyer,
    confirmSchedule,
    getLawyerByOab,
    schedules,
    loading,
    error,
    selectedDate,
    selectedHour,
    updateDateAndHour, // Função para permitir atualização
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
