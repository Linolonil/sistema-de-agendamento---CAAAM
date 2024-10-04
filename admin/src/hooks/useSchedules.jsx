// src/hooks/useSchedules.js

import { useState, useEffect } from 'react';
import { fetchSchedules, fetchRooms } from '../services/api';

export const useSchedules = (selectedDate) => {
  const [schedules, setSchedules] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("@Auth:token");
    const fetchAll = async () => {
      setLoading(true);
      try {
        const schedulesResponse = await fetchSchedules(selectedDate, token);
        setSchedules(schedulesResponse.data.schedules);

        const roomsResponse = await fetchRooms(token);
        setRooms(roomsResponse.data.rooms);
      } catch (error) {
        console.error(error);
        setError('Erro ao buscar os dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedDate]);

  return { schedules, rooms, loading, error };
};
