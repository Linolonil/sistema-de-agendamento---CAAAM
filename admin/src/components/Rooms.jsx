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

  const [selectedRoomId, setSelectedRoomId] = useState();

  // Função para filtrar os agendamentos pela hora selecionada
  const getFilteredSchedules = () => {
    const filteredSchedules =schedules.filter((schedule) => schedule.time === horario);
    console.log(schedules.filter((schedule) => schedule.time === horario))
    return filteredSchedules
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

  const sendWhatsAppMessage = (schedule) => {
    if (!schedule) return;
    
    const { roomId, date, originHour, time, endTime, lawyerId, type } = schedule;
    const roomNumber = roomId.number;
    const dateFormatted = new Date(date).toLocaleDateString('pt-BR'); 
    const startTime = originHour.split(":")[0]; 
    const startTimeMeeting = time
    const maxPeople = roomId.capacity; 
    const number = lawyerId.phoneNumber;

    let message = "";

    if (type === "meeting") {
        message = `Confirmado agendamento para reunião na Sala: ${roomNumber}.\nData: ${dateFormatted}.\nHorário: ${startTimeMeeting}:00 - ${endTime}:00.\nNúmero máximo de pessoas: ${maxPeople}.\nTolerância de 15 minutos, após o prazo a sala será disponibilizada para novo atendimento (em caso de atraso, avisar imediatamente o atendimento).`;
    } else if (type === "hearing") {
        message = `Confirmado agendamento para audiência na Sala: ${roomNumber}.\nData: ${dateFormatted}.\nHorário: ${startTime}:00 - ${endTime}.\nNúmero máximo de pessoas: ${maxPeople}.\nTolerância de 15 minutos, após o prazo a sala será disponibilizada para novo atendimento (em caso de atraso, avisar imediatamente o atendimento).`;
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
          className={`cursor-pointer transition-colors duration-300 hover:bg-gray-700 ${
            selectedRoomId === room._id ? "hover:bg-green-600 bg-green-500" : ""
          }`}
        >
          <td className="w-10 border-b border-gray-600 p-2 text-center mx-auto">
            <Button
              className={`flex justify-center items-center rounded-full w-10 h-10 text-white text-xl font-bold text-center ${
                isOccupied
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-green-700 hover:bg-green-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isOccupied) {
                  handleConfirm(currentSchedule._id);
                }
              }}
            >
              {room.number}
            </Button>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p
              className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-gray-200"
              title={isOccupied ? currentSchedule.lawyerId.name : "Disponível"}
            >
              {isOccupied ? currentSchedule.lawyerId.name.split(" ")[0] : "Disponível"}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] text-gray-200">
              {isOccupied ? currentSchedule.lawyerId.oab : ""}
            </p>
          </td>

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <p
              className={`rounded-full p-1 text-white ${
                isOccupied && currentSchedule.type === "meeting"
                  ? "bg-blue-500"
                  : isOccupied && currentSchedule.type === "hearing"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {isOccupied
                ? currentSchedule.type === "meeting"
                  ? "Reunião"
                  : "Audiência"
                : ""}
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
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                        room.hasTV ? "text-gray-200" : "text-gray-800"
                      }`}
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
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                        room.hasAirConditioning ? "text-gray-200" : "text-gray-800"
                      }`}
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
                      className={`hover:text-amber-200 transition-colors ease-in-out duration-200 ${
                        room.hasComputer ? "text-gray-200" : "text-gray-800"
                      }`}
                      title="Computador"
                    >
                      <Laptop />
                    </button>
                    <div
                      className="flex justify-center items-center text-gray-200"
                      title="Quantidade de Pessoas na sala"
                    >
                      <PersonStanding />
                      <p className="text-gray-200 text-md font-bold">
                        {room.capacity}
                      </p>
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

          <td className="border-b border-gray-600 p-2 text-center mx-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                deleteSchedule(currentSchedule._id);
              }}
              disabled={!isOccupied}
              className={`bg-red-600 hover:bg-red-500 text-white font-bold p-2 rounded-full transition-colors duration-200`}
              title="Excluir Agendamento"
            >
              <TrashIcon />
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-lg bg-gray-800">
      <table className="w-full border-collapse bg-gray-800">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-gray-600 p-4 text-left">
                <Typography className="font-bold text-gray-200">{head}</Typography>
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
