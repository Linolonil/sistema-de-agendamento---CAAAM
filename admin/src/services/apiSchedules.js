import api from "./api";

export const fetchAllSchedules = async (date, token) => {
  const response = await api.get(`api/v1/schedules/schedules/day/${date}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // Retorna diretamente os dados da resposta
};

export const fetchAllRooms = async (token) => {
  const response = await api.get(`/api/v1/room/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
 
export const getLawyer = async (oab) => {
  const response = await api.get(`/api/v1/lawyer/lawyer/${oab}`);
  return response.data;
};

export const createUserLawyer = async (name, oab, phoneNumber) => {
  const response = await api.post(`/api/v1/lawyer`, { name, oab, phoneNumber });
  return response.data;
};

export const createNewSchedule = async ({
  roomId,
  lawyerId,
  userId,
  date,
  time: hour,
  type,
  token
}) => {

  console.log({  roomId,
    lawyerId,
    userId,
    date,
    time: hour,
    type,})

  const response = await api.post(
    `/api/v1/schedules/new`,
    {
      roomId,
      lawyerId,
      userId,
      date,
      time: hour,
      type,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const confirmScheduleNow = async (scheduleId, token) => {
  const response = await api.patch(`/api/v1/schedules/${scheduleId}/confirm`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  console.log(response);
  return response.data;
};


export const changeRoom = async (roomId, {
  hasAirConditioning,
  hasTV,
  hasComputer,
} ) => {
  const response = await api.put(`/api/v1/room/${roomId}`, {
    hasAirConditioning,
    hasTV,
    hasComputer,
  });
  return  response.status;
};

export const deleteScheduleById = async (scheduleId) => {
  const response = await api.delete(`api/v1/schedules/delete/${scheduleId}`);
  return response

};

export const infoSchedules = async (token, idUser) =>{
 const response = await api.post('/api/v1/schedules/data',{
  idUser},{
  headers: {
    Authorization: `Bearer ${token}`,
  },
 })
 const { totalAgendamentos, totalAdvogadosCadastrados, totalMeetings, totalHearings, totalScheduleFromUser} = response.data;
 return {totalAdvogadosCadastrados, totalAgendamentos, totalMeetings, totalHearings, totalScheduleFromUser}

}

export const validadeToken = async () => {
  const response = await api.get('/api/v1/auth/validate-token')
  console.log(response)
  return response
}