import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import api from './../../../services/api';

const Admin = () => {
  const { signed, SignOut } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [lawyer, setLawyer] = useState({ name: "", oab: "", phone: "" });
  const [newAppointment, setNewAppointment] = useState({
    name: "",
    oab: "",
    phone: "",
    room: "",
    date: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("@Auth:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    SignOut();
  };

  // Generate rooms 1 to 13
  const generateRooms = () => {
    const rooms = [];
    for (let i = 1; i <= 13; i++) {
      rooms.push(`Sala ${i}`);
    }
    return rooms;
  };

  // Generate schedule slots
  const generateTimeSlots = (date) => {
    const slots = [];
    const isThursday = new Date(date).getDay() === 4; // Check if it's Thursday
    const endHour = isThursday ? 17 : 18;

    for (let hour = 8; hour <= endHour; hour++) {
      const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(formattedHour);
    }

    return slots;
  };
  
  console.log(schedules)
  // Fetch available schedules when date is selected
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    try {
      const response = await api.get(`/api/v1/schedules/schedules/day/?date=${date}`);
      setSchedules(response.data);
      // Generate available rooms based on schedules
      const allRooms = generateRooms();
      const timeSlots = generateTimeSlots(date);

      const occupiedRooms = response.data.schedules.map(schedule => ({
        room: schedule.room,
        time: schedule.time,
      }));

      // Filter rooms that are available
      const available = allRooms.filter(room => {
        return timeSlots.some(timeSlot => {
          return !occupiedRooms.some(
            occupied => occupied.room === room && occupied.time === timeSlot
          );
        });
      });

      setAvailableRooms(available);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  // Fetch lawyer details by OAB
  const handleOABChange = async (e) => {
    const oab = e.target.value;
    setNewAppointment({ ...newAppointment, oab });

    try {
      const response = await api.get(`/api/v1/lawyer?oab=${oab}`);
      if (response.data.lawyer) {
        setLawyer(response.data.lawyer);
        setNewAppointment({
          ...newAppointment,
          name: response.data.lawyer.name,
          phone: response.data.lawyer.phone,
        });
      } else {
        setLawyer({ name: "", oab: "", phone: "" });
      }
    } catch (error) {
      toast.error("Erro ao buscar advogado.");
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  // Submit new appointment
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/v1/schedule", newAppointment);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar agendamento.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {signed ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-black">Bem-vindo, {user.name}!</h1>

            {/* Agendamento Section */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-black">Selecione o dia:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border rounded px-4 py-2 w-full"
              />
            </div>

            {/* Show available rooms */}
            <div className="mb-4">
              <h2 className="font-semibold text-black">Salas Disponíveis:</h2>
              <ul className="list-disc ml-6">
                {availableRooms.length > 0 ? (
                  availableRooms.map((room) => <li key={room}>{room}</li>)
                ) : (
                  <li>Nenhuma sala disponível</li>
                )}
              </ul>
            </div>

            {/* Agendamento Form */}
            <form onSubmit={handleAppointmentSubmit} className="mb-4">
              <label className="block mb-2 font-semibold text-black">OAB:</label>
              <input
                type="text"
                name="oab"
                value={newAppointment.oab}
                onChange={handleOABChange}
                className="border rounded px-4 py-2 w-full"
              />

              <label className="block mb-2 font-semibold text-black">Nome:</label>
              <input
                type="text"
                name="name"
                value={newAppointment.name}
                onChange={handleInputChange}
                className="border rounded px-4 py-2 w-full"
                disabled={lawyer.name ? true : false} // Disable if name is fetched
              />

              <label className="block mb-2 font-semibold text-black">Telefone:</label>
              <input
                type="text"
                name="phone"
                value={newAppointment.phone}
                onChange={handleInputChange}
                className="border rounded px-4 py-2 w-full"
                disabled={lawyer.phone ? true : false} // Disable if phone is fetched
              />

              <label className="block mb-2 font-semibold text-black">Sala:</label>
              <select
                name="room"
                value={newAppointment.room}
                onChange={handleInputChange}
                className="border rounded px-4 py-2 w-full"
              >
                <option value="">Selecione uma sala</option>
                {availableRooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 mt-4"
              >
                Agendar
              </button>
            </form>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-300 mt-4"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
