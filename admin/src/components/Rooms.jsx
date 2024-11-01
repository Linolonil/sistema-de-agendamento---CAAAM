import { useContext, useState } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";
import { ScheduleContext } from "./../context/SchedulesContext";
import {
  AirVent,
  Info,
  Laptop,
  MailCheck,
  PersonStanding,
  TrashIcon,
  Tv,
} from "lucide-react";

const TABLE_HEAD = [
  "Sala",
  "Ocupante",
  "OAB",
  "Tipo",
  "Status da Sala",
  "WhatsApp",
  "Excluir",
];

function Rooms() {
  const {
    rooms,
    schedules,
    confirmSchedule,
    setRoomId,
    deleteSchedule,
    changeRoomState,
    horario,
  } = useContext(ScheduleContext);

  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // Função para filtrar os agendamentos pela hora selecionada
  const getFilteredSchedules = () => {
    return schedules.filter((schedule) => schedule.time === horario);
  };

  const handleConfirm = (scheduleId) => {
    confirmSchedule(scheduleId);
  };

  const handleRoomSelect = (roomId) => {
    // Alterna a seleção da sala
    setSelectedRoomId((prevSelected) => (prevSelected === roomId ? null : roomId));
    setRoomId(roomId);
  };

  const sendWhatsAppMessage = (schedule) => {
    if (!schedule) return;

    const { roomId, date, originHour, time, endTime, lawyerId, type } = schedule;
    const roomNumber = roomId.number;
    const dateFormatted = new Date(date).toLocaleDateString('pt-BR');
    const startTimeMeeting = time;
    const maxPeople = roomId.capacity;
    const number = lawyerId.phoneNumber;

    let message = "";

    if (type === "meeting") {
      message = ` *Confirmação de Agendamento para Reunião*
        \n\n
        *Sala:* ${roomNumber}\n
        *Data:* ${dateFormatted}\n
        *Horário:* ${startTimeMeeting} - ${endTime}\n
        *Capacidade Máxima:* ${maxPeople} pessoas\n
        \n\n
        *Observação:* Há uma tolerância de 15 minutos. Caso ocorra atraso, informe a recepção imediatamente, pois após esse período a sala poderá ser disponibilizada para outros atendimentos.`;
    } else if (type === "hearing") {
      message = ` *Confirmação de Agendamento para Audiência*
        \n\n
        *Sala:* ${roomNumber}\n
        *Data:* ${dateFormatted}\n
        *Horário:* ${originHour} - ${endTime}\n
        *Capacidade Máxima:* ${maxPeople} pessoas\n
        \n\n
        *Observação:* Há uma tolerância de 15 minutos. Caso ocorra atraso, informe a recepção imediatamente, pois após esse período a sala poderá ser disponibilizada para outros atendimentos.`;
    } else {
      console.error("Tipo de agendamento inválido.");
      return;
    }

    const whatsappNumber = `+55${number}`; // Formato do número do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    window.open(whatsappLink, "_blank"); // Abre o WhatsApp
  };

  const renderRooms = () => {
    const filteredSchedules = getFilteredSchedules();
    return rooms.map((room) => {
      // Verifica se a sala está ocupada
      const currentSchedule = filteredSchedules.find(schedule => schedule.roomId._id === room._id);
      const isOccupied = !!currentSchedule;

      return (
        <tr
          key={room._id}
          onClick={() => handleRoomSelect(room._id)}
          className={`cursor-pointer transition-colors duration-300 hover:bg-gray-700 ${selectedRoomId === room._id ? "bg-green-500" : ""}`}
        >
          <td className="w-10 border-b border-gray-600 p-2 text-center mx-auto">
            <Button
              className={`flex justify-center items-center rounded-full w-10 h-10 text-white text-xl font-bold text-center ${
                isOccupied && currentSchedule.confirmed
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isOccupied && currentSchedule) {
                  handleConfirm(currentSchedule._id);
                }
              }}
            >
              {room.number}
            </Button>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-gray-200" title={isOccupied ? currentSchedule.lawyerId.name : "Disponível"}>
              {isOccupied ? currentSchedule.lawyerId.name.split(" ")[0] : "Disponível"}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] text-gray-200">
              {isOccupied ? currentSchedule.lawyerId.oab : ""}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p className={`rounded-full p-1 text-white ${isOccupied && currentSchedule.type === "meeting" ? "bg-blue-500" : isOccupied && currentSchedule.type === "hearing" ? "bg-red-600" : "bg-gray-500"}`}>
              {isOccupied ? (currentSchedule.type === "meeting" ? "Reunião" : "Audiência") : ""}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto relative">
            <Popover>
              <PopoverHandler onClick={(e) => e.stopPropagation()}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-lg`}
                >
                  <Info />
                </Button>
              </PopoverHandler>
              <PopoverContent
                className="p-4 bg-gray-900 text-white rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 text-center mx-auto">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeRoomState(
                          room._id,
                          room.hasAirConditioning,
                          !room.hasTV,
                          room.hasComputer
                        );
                      }}
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${room.hasTV ? "text-gray-200" : "text-gray-800"}`}
                      title="TV"
                    >
                      <Tv />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeRoomState(
                          room._id,
                          !room.hasAirConditioning,
                          room.hasTV,
                          room.hasComputer
                        );
                      }}
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${room.hasAirConditioning ? "text-gray-200" : "text-gray-800"}`}
                      title="Ar-Condicionado"
                    >
                      <AirVent />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changeRoomState(
                          room._id,
                          room.hasAirConditioning,
                          room.hasTV,
                          !room.hasComputer
                        );
                      }}
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${room.hasComputer ? "text-gray-200" : "text-gray-800"}`}
                      title="Computador"
                    >
                      <Laptop />
                    </button>
                    <div className="flex justify-center items-center text-gray-200" title="Quantidade de Pessoas na sala">
                      <PersonStanding />
                      <p className="text-gray-200 text-md font-bold">{room.capacity}</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendWhatsAppMessage(currentSchedule);
              }}
              className={`hover:text-amber-200 transition-colors ease-in-out duration-200`}
              title="Enviar mensagem"
            >
              <MailCheck />
            </button>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSchedule(currentSchedule?._id);
              }}
              className={`hover:text-red-600 transition-colors ease-in-out duration-200`}
              title="Excluir agendamento"
            >
              <TrashIcon />
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-600">
        <thead>
          <tr className="bg-gray-800 text-white">
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-gray-600 p-2">
                <Typography variant="h6" className="text-center">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRooms()}</tbody>
      </table>
    </div>
  );
}

export default Rooms;
