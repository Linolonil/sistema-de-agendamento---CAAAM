import { useContext } from "react";
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
import { TrashIcon } from "lucide-react";

const getCurrentDateAndHour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ViewSchedules() {
  const {
    rooms,
    schedules,
    setDate,
    date,
    updateDate,
    horario,
    deleteSchedule,
    loading, // Certifique-se de que loading é um valor vindo do contexto
  } = useContext(ScheduleContext);
  
  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = getCurrentDateAndHour(date);
    updateDate(formattedDate, horario);
  };

  const hours = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  const hourFormated = hours.map((hour) => hour.split(" - ")[0]);

  const dateNow = new Date();
  const hourNow = dateNow.getHours();

  // Renderiza a tabela com os horários
  const renderScheduleTable = () => (
    <div className="overflow-auto">
      <div className="w-full flex justify-center items-center gap-4 mb-1">
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          className="w-full mt-2 bg-gray-900 text-gray-100 text-center text-xl py-2 rounded"
          locale={ptBR}
          required
        />
        <div className="w-5 h-5 rounded-full bg-blue-500"></div>
        <p>Reunião</p>
        <div className="w-5 h-5 rounded-full bg-red-500"></div>
        <p>Audiência</p>
        <div className="w-5 h-5 rounded-full bg-green-500"></div>
        <p>Presença</p>
        <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
        <p>Hora atual</p>
      </div>

      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Hora</th>
            {rooms.map((room) => (
              <th key={room._id} className={`border border-gray-400 p-2`}>
                Sala {room.number}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hourFormated.map((hour) => {
            const isCurrentHour = parseInt(hour.split(":")[0]) === hourNow; // Verifica se é a hora atual
            return (
              <tr key={hour}>
                <td
                  className={`border border-gray-400 p-3 text-center ${
                    isCurrentHour ? "border-t-4 border-t-yellow-800" : ""
                  }`}
                >
                  {hour}
                </td>
                {rooms.map((room) => {
                  const hourTime = hour.split(" - ")[0].trim();
                  const schedule = schedules.find(
                    (sched) =>
                      sched.time === hourTime && sched?.roomId._id === room._id
                  );
                  return (
                    <td
                      key={room._id}
                      className={`${
                        schedule?.type === "meeting"
                          ? "bg-blue-500"
                          : schedule?.type === "hearing"
                          ? "bg-red-700"
                          : "bg-gray-900"
                      } border border-gray-400 p-2 text-center ${
                        isCurrentHour ? "border-t-4 border-t-yellow-800" : ""
                      }`}
                    >
                      {schedule ? (
                        <Popover>
                          <PopoverHandler>
                            <Button
                              className={`${
                                schedule.confirmed
                                  ? "bg-green-600"
                                  : "bg-gray-900"
                              } hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-lg`}
                            >
                              {schedule?.lawyerId.name.split(" ")[0]}
                            </Button>
                          </PopoverHandler>
                          <PopoverContent className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
                            <div className="mb-2">
                              <Typography variant="h5" className="text-gray-400">
                                {schedule.type === "meeting"
                                  ? "Reunião"
                                  : "Audiência"}
                              </Typography>
                            </div>

                            <hr className="my-2 border-gray-600" />

                            <div className="mb-2">
                              <Typography variant="h6" className="font-medium">
                                Advogado:
                              </Typography>
                              <Typography variant="small" className="text-gray-400">
                                Id: {schedule?.lawyerId._id}
                              </Typography>
                              <Typography variant="small" className="text-gray-400">
                                Nome: {schedule?.lawyerId.name}
                              </Typography>
                              <Typography variant="small" className="text-gray-400">
                                OAB: {schedule?.lawyerId.oab}
                              </Typography>
                              <Typography variant="small" className="text-gray-400">
                                Telefone: {schedule?.lawyerId.phoneNumber}
                              </Typography>
                            </div>

                            <hr className="my-2 border-gray-600" />

                            <div className="mb-2">
                              <Typography variant="h6" className="font-medium">
                                Usuário:
                              </Typography>
                              <Typography variant="small" className="text-gray-400">
                                {schedule?.userId.name}
                              </Typography>
                            </div>
                            <div className="border-t border-gray-600 p-2 text-center mx-auto">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      "Você tem certeza que deseja excluir este agendamento?"
                                    )
                                  ) {
                                    deleteSchedule(schedule._id);
                                  }
                                }}
                                className="w-5 h-5 rounded-full relative bg-gray-900 shadow-none hover:text-white hover:scale-105 group"
                              >
                                <TrashIcon className="size-4 absolute bottom-1 left-4 text-red-600" />
                              </Button>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Renderiza o conteúdo
  return (
    <div className="w-full flex justify-center items-center h-full">
      {loading ? (
        <Button loading={true} size="lg" className="text-2xl flex justify-center items-center">
          Carregando...
        </Button>
      ) : (
        renderScheduleTable()
      )}
    </div>
  );
}

export default ViewSchedules;
