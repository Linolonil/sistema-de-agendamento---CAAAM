import { useContext, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { ScheduleContext } from "./../context/SchedulesContext";
import { AirVent, Laptop, PersonStanding, TrashIcon, Tv } from "lucide-react";

const TABLE_HEAD = [
  "Sala",
  "Ocupante",
  "OAB",
  "Tipo",
  "Informações",
  "Qtnd.",
  "Excluir",
];

function Rooms() {
  const {
    rooms,
    schedules,
    confirmSchedule,
    loading,
    error,
    setRoomId,
    deleteSchedule,
    changeRoomState,
    horario,
  } = useContext(ScheduleContext);
  const [selectedRoomId, setSelectedRoomId] = useState();

  // Função para filtrar os agendamentos pela hora selecionada
  const getFilteredSchedules = () => {
    return schedules.filter((schedule) => schedule.time === horario); // Filtra pela propriedade `time`
  };

  const handleConfirm = (roomId) => {
    confirmSchedule(roomId);
  };

  const handleRoomSelect = (roomId) => {
    if (roomId === selectedRoomId) {
      setSelectedRoomId(null);
      setRoomId(null);
    } else {
      setSelectedRoomId(roomId);
      setRoomId(roomId);
    }
  };

  const renderRooms = () => {
    const filteredSchedules = getFilteredSchedules(); // Obtém os agendamentos filtrados
    return rooms.map((room) => {
      const schedule = filteredSchedules.find(
        (schedule) => schedule.roomId._id === room._id
      ); // Acesso à propriedade correta

      return (
        <tr
          key={room._id}
          onClick={() => handleRoomSelect(room._id)}
          className={`cursor-pointer transition-colors duration-300 hover:bg-gray-700 ${
            selectedRoomId === room._id ? "hover:bg-green-600 bg-green-500" : ""
          }`}
        >
          <td className="w-10 border-b border-gray-600 p-2 text-center mx-auto">
            <Button
              className={`flex justify-center items-center rounded-full w-10 h-10 text-white text-xl font-bold text-center ${
                schedule && schedule.confirmed
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                // Aqui, você deve verificar se o agendamento existe antes de tentar confirmar
                if (schedule) {
                  handleConfirm(schedule._id);
                }
              }}
            >
              {room.number}
            </Button>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p
              className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-gray-200"
              title={schedule ? schedule.lawyerId.name : ""}
            >
              {schedule ? schedule.lawyerId.name : "Disponível"}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] text-gray-200">
              {schedule ? schedule.lawyerId.oab : ""}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p
              className={`rounded-full p-1 text-white ${
                schedule?.type === "meeting"
                  ? "bg-blue-500"
                  : schedule?.type === "hearing"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {schedule
                ? schedule.type === "meeting"
                  ? "Reunião"
                  : "Audiência"
                : ""}
            </p>
          </td>
          {/* informations */}
          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Impede que o clique se propague para a linha
                  changeRoomState(
                    room._id,
                    room.hasAirConditioning,
                    !room.hasTV,
                    room.hasComputer
                  );
                }}
                className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                  room.hasTV ? "text-gray-200" : "text-gray-800"
                }`}
                title="TV"
              >
                <Tv />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Impede que o clique se propague para a linha
                  changeRoomState(
                    room._id,
                    !room.hasAirConditioning,
                    room.hasTV,
                    room.hasComputer
                  );
                }}
                className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                  room.hasAirConditioning ? "text-gray-200" : "text-gray-800"
                }`}
                title="Ar-Condicionado"
              >
                <AirVent />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Impede que o clique se propague para a linha
                  changeRoomState(
                    room._id,
                    room.hasAirConditioning,
                    room.hasTV,
                    !room.hasComputer
                  );
                }}
                className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                  room.hasComputer ? "text-gray-200" : "text-gray-800"
                }`}
                title="Computador"
              >
                <Laptop />
              </button>
            </div>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <div
              className="flex justify-center items-center text-gray-200"
              title="Quantidade de Pessoas na sala"
            >
              <PersonStanding />
              <p className="text-gray-200 text-md font-bold">{room.capacity}</p>
            </div>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            {schedule ? (
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
            ) : (
              ""
            )}
          </td>
        </tr>
      );
    });
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <Card className="h-full w-full overflow-auto bg-dark p-4">
      {/* Seletor de hora */}
      {/* <div className="mb-4">
        <label htmlFor="timeFilter" className="text-white">
          Filtrar por hora:
        </label>
        <select
          id="timeFilter"
          value={horario}
          onChange={(e) => sethorario(e.target.value)}
          className="ml-2 p-1 rounded border border-gray-600 bg-gray-800 text-white"
        >
          <option value="8:00">08:00</option>
          <option value="9:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
          <option value="18:00">18:00</option>
        </select>
      </div> */}

      <table className="w-full overflow-hidden h-full table-auto text-center border-collapse">
        <thead className="text-center">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b bg-gray-900 p-4 text-center border-gray-700"
              >
                <Typography
                  variant="small"
                  color="white"
                  className="font-bold leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRooms()}</tbody>
      </table>
    </Card>
  );
}

export default Rooms;
