import { useContext, useState, useEffect } from "react";
import ScheduleContext from "../context/SchedulesContext";
import DatePicker from "react-datepicker";
import { ptBR } from "date-fns/locale";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";

const getCurrentDateAndHour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ViewSchedules() {
  const { rooms, schedules, setDate, date, updateDate, horario } =
    useContext(ScheduleContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading schedules or handle it when data changes
    if (schedules.length > 0) {
      setLoading(false);
    }
  }, [schedules]);

  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = getCurrentDateAndHour(date);
    updateDate(formattedDate, horario);
  };

  const hours = [
    "8:00 - 9:00",
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  if (loading) return <div>Loading schedules...</div>;

  return (
    <div className="overflow-auto">
      <div className="w-full  flex justify-center items-center gap-4 mb-1 ">
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          className="w-full   mt-2 bg-gray-900 text-gray-100 text-center text-xl py-2 rounded"
          locale={ptBR}
          required
        />
        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
        <p>Reunião</p>
        <div className="w-5 h-5 rounded-full bg-red-500"></div>
        <p>Audiência</p>
      </div>

      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Hora</th>
            {rooms.map((room) => (
              <th key={room._id} className="border border-gray-400 p-2">
                Sala {room.number}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="border border-gray-400 p-3 text-center">{hour}</td>
              {rooms.map((room) => {
                const hourTime = hour.split(" - ")[0].trim();
                const schedule = schedules.find(
                  (sched) =>
                    sched.time === hourTime && sched?.roomId._id === room._id
                );
                return (
                  <td
                    key={room._id}
                    className={`${schedule?.type === "meeting" ? "bg-blue-500" : schedule?.type === "hearing"? "bg-red-700" : "bg-gray-900" } border border-gray-400 p-2 text-center`}
                  >
                    {schedule ? (
                     <Popover>
                     <PopoverHandler>
                       <Button className={`${schedule.confirmed ? "bg-green-600" : "bg-gray-900"} hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-lg`}>
                         {schedule ? schedule?.lawyerId.name.split(" ")[0] : "Selecionar Advogado"}
                       </Button>
                     </PopoverHandler>
                     <PopoverContent className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
                       <div className="mb-2">
                         <Typography variant="h6" className="font-semibold">
                           Detalhes da Programação
                         </Typography>
                         <Typography variant="body2" className="text-gray-400">
                           {schedule ? (schedule.type === "meeting" ? "Reunião" : "Audiência") : "N/A"}
                         </Typography>
                       </div>
               
                       <hr className="my-2 border-gray-600" />
               
                       <div className="mb-2">
                         <Typography variant="body1" className="font-medium">
                           Advogado:
                         </Typography>
                         <Typography variant="body2" className="text-gray-400">
                           {schedule ? schedule?.lawyerId.name : "N/A"}
                         </Typography>
                         <Typography variant="body2" className="text-gray-400">
                           OAB: {schedule ? schedule?.lawyerId.oab : "N/A"}
                         </Typography>
                         <Typography variant="body2" className="text-gray-400">
                           Telefone: {schedule ? schedule?.lawyerId.phoneNumber : "N/A"}
                         </Typography>
                       </div>
               
                       <hr className="my-2 border-gray-600" />
               
                       <div>
                         <Typography variant="body1" className="font-medium">
                           Usuário:
                         </Typography>
                         <Typography variant="body2" className="text-gray-400">
                           {schedule ? schedule?.userId.name : "N/A"}
                         </Typography>
                       </div>
                     </PopoverContent>
                   </Popover>
                    ) : (
                      ""
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewSchedules;
