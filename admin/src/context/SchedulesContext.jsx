import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { toast } from 'react-toastify';

export const ScheduleContext = createContext();


const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adiciona 0 se necessário
  const day = String(now.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;
   return { date  };
};


export const ScheduleProvider = ({ children }) => {
  // Estados para agendamentos
  const [schedules, setSchedules] = useState([]);
  const [tipoAgendamento, setTipoAgendamento] = useState("meeting");
  const [userId, setUserId] = useState(null);
  
  // estado para sala de agendamento
  const [horario, setHorario] = useState("8:00");
  const [date, setDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(null);

  // estado para advogado
  const [oab, setOab] = useState("");
  const [lawyer, setLawyer] = useState(null);
  
  // estados de erro e carregamento
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para armazenar data e hora
  const [selectedDate, setSelectedDate] = useState();

  useEffect(()=>{
    setSelectedDate(getCurrentDate().date)
  },[]),


  // useEffect para buscar user no localstorage
  useEffect(() => {
    const storedUser = localStorage.getItem("@Auth:user"); 
       if (storedUser ) {
      setUserId(JSON.parse(storedUser)._id)
    }
  },[])

  // useEffect pra iniciar as salas
  useEffect(()=>{
    fetchRooms()
  },[])

   // userEffect inicial para buscar com a data atual
   useEffect(() => {
    fetchSchedules(selectedDate);
  }, [selectedDate]);



  // busca agendamentos 
  const fetchSchedules = async (date) => {
    const token = localStorage.getItem("@Auth:token");
    setLoading(true);
    try {
       const response = await api.get(`api/v1/schedules/schedules/day/${date}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { schedules } = response.data;  
      setSchedules(schedules);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Erro ao buscar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // busca salas
  const fetchRooms = async () =>{
    const token = localStorage.getItem("@Auth:token");
    setLoading(true);
    try {
       const response = await api.get(`/api/v1/room/`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { rooms } = response.data;  
      setRooms(rooms);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Erro ao buscar os dados das salas.');
    } finally {
      setLoading(false);
    }
  };
 
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
      return response.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  // cria novo agendamento
  const createSchedule = async ({ date, hour, roomId, lawyerId, userId, type }) => {
    try {
        const response = await api.post(`api/v1/schedules`, {
            roomId,
            lawyerId,
            userId,
            date,
            time: hour,
            type,
        });

        // Verifica se a resposta contém a propriedade 'success' e se é true
        if (response.data.success) {
          toast.dismiss(); 
            toast.success("Agendamento criado com sucesso!");
            setLawyer(null)
            setOab(null)
            setRoomId(null)
            await fetchSchedules(selectedDate);
            return;
        } else {
          toast.dismiss(); 
            toast.error("Erro ao criar agendamento!");
            return;
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Erro ao criar agendamento!";
        toast.dismiss(); 
        toast.error(errorMessage);
        return error.response?.data; // Retorna os dados de erro se disponíveis
    }
};

  // Função para o usuário atualizar a data 
  const updateDate = (newDate) => {
    setSelectedDate(newDate);
  };

  // Função para confirmar um agendamento
  const confirmSchedule = async (scheduleId) => {
    if(!scheduleId || scheduleId === undefined)  {

      toast.dismiss()
      toast.info("Sala disponível!")
      return
    };

    try {
      const response = await api.patch(`api/v1/schedules/${scheduleId}/confirm`);
        toast.dismiss()
        toast.success(response.data.message);
        fetchSchedules(selectedDate);
     
    } catch (error) {
      console.log(error);
      toast.dismiss()
      toast.error("Erro ao confirmar agendamento!");
    }
  }

  // função pra mudar o estado da sala, se tem ar, tv
  const changeRoomState = async (roomId, hasAirConditioning, hasTV, hasComputer) => {
    try {
      const response = await api.put(`http://localhost:5000/api/v1/room/${roomId}`, {
        hasAirConditioning,
        hasTV,
        hasComputer,
      });
  
      if (response.status !== 200) {
        toast.error('Erro ao atualizar a sala!');    
        return;
      }
  
      // Atualiza o estado das salas com os novos dados
      setRooms((prevRooms) => 
        prevRooms.map(room => 
          room._id === roomId 
            ? { ...room, hasAirConditioning, hasTV, hasComputer } 
            : room
        )
      );
  
      // Atualiza os agendamentos
      fetchSchedules(selectedDate);
      toast.dismiss(); 
      toast.success('Sala atualizada com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao atualizar a sala!');
    }
  };
  
  // exclui um agendamento
  const deleteSchedule = async (scheduleId) => {
    try {
      const response = await api.delete(`api/v1/schedules/delete/${scheduleId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchSchedules(selectedDate);
      } else {
        toast.error("Erro ao excluir agendamento!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao excluir agendamento!");
    }
  }             


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
    setRoomId,
    setLawyer,
    setUserId,
    setDate,
    setHorario,
    fetchRooms,
    rooms,
    setTipoAgendamento,
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
