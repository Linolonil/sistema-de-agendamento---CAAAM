import { useContext, useState } from "react";
import {
  Button,
  Card,
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
  "Whatsaap",
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
    tipoAgendamento,
    horario,
  } = useContext(ScheduleContext);
  const [selectedRoomId, setSelectedRoomId] = useState();

  // Função para filtrar os agendamentos pela hora selecionada
  const getFilteredSchedules = () => {
    return schedules.filter((schedule) => schedule.time === horario);
  };

  const getRoomsAvailableForHearing = () => {
    const selectedTime = horario; // Hora selecionada
    const unavailableRooms = ['66f32a07b0a8fbb2cdf4e257', '66f32a07b0a8fbb2cdf4e265']; // IDs das salas que nunca devem estar disponíveis
  
    const availableRooms = rooms.filter((room) => {
      // Verifica se a sala está ocupada nos próximos 3 horários
      const isRoomOccupied = schedules.some((schedule) => {
        const scheduleTime = schedule.time; 
        const roomId = schedule.roomId._id;
  
        // Verifica se a sala corresponde à sala atual e se está dentro do intervalo de tempo
        const isSameRoom = roomId === room._id;
        const isWithinNextThreeHours = isTimeWithinNextThreeHours(
          scheduleTime,
          selectedTime
        );
  
        return isSameRoom && isWithinNextThreeHours;
      });
  
      // Retorna true se a sala NÃO estiver ocupada e se não for uma sala indisponível
      return !isRoomOccupied && !unavailableRooms.includes(room._id);
    });
  
    return availableRooms;
  };
  

  const isTimeWithinNextThreeHours = (scheduleTime, selectedTime) => {
    const [scheduleHour] = scheduleTime.split(":").map(Number);
    const [selectedHour] = selectedTime.split(":").map(Number);

    // Verifica se o horário está no intervalo de 3 horas
    return scheduleHour >= selectedHour && scheduleHour < selectedHour + 3;
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

  const sendWhatsAppMessage = (Schedule) => {
    const { roomId, date, time, lawyerId, type } = Schedule;
    const roomNumber = roomId.number;
    const dateFormatted = new Date(date).toLocaleDateString('pt-BR'); 
    const startTime = time.split(":")[0]; 
    const endTime = Number(startTime) + 1;
    const maxPeople = roomId.capacity; 
    const number = lawyerId.phoneNumber;


    let message = "";

    if (type === "meeting") {
        message = `Confirmado agendamento para reunião na Sala: ${roomNumber}.\nData: ${dateFormatted}.\nHorário: ${startTime}:00 - ${endTime}:00.\nNúmero máximo de pessoas: ${maxPeople}.\nTolerância de 15 minutos, após o prazo a sala será disponibilizada para novo atendimento (em caso de atraso, avisar imediatamente o atendimento).`;
    } else if (type === "hearing") {
        message = `Confirmado agendamento para audiência na Sala: ${roomNumber}.\nData: ${dateFormatted}.\nHorário: ${startTime}:00 - ${endTime}:00.\nNúmero máximo de pessoas: ${maxPeople}.\nTolerância de 15 minutos, após o prazo a sala será disponibilizada para novo atendimento (em caso de atraso, avisar imediatamente o atendimento).`;
    } else {
        console.error("Tipo de agendamento inválido.");
        return;
    }

    const whatsappNumber = `+55${number}`; // Formato do número do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank"); // Abre o WhatsApp
};

  const renderRooms = () => {
    const availableRooms =
      tipoAgendamento === "hearing" ? getRoomsAvailableForHearing() : rooms; // Se for audiência, exibe apenas as disponíveis
    const filteredSchedules = getFilteredSchedules(); // Obtém os agendamentos filtrados

    return availableRooms.map((room) => {
      const schedule = filteredSchedules.find(
        (schedule) => schedule.roomId._id === room._id
      );
      
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
              {schedule ? schedule.lawyerId.name.split(" ")[0] : "Disponível"}
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
          <td className="border-b border-gray-600 p-2 text-center mx-auto relative" >
            <Popover>
              <PopoverHandler onClick={(e) => e.stopPropagation()}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique se propague para a linha
                  }}
                  className={`hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded-lg`}
                >
                  <Info />
                </Button>
              </PopoverHandler>
              <PopoverContent
                className="p-4 bg-gray-900 text-white rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()} // Impede que o clique se propague ao conteúdo do popover
              >
                <div className="p-2 text-center mx-auto">
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
                        room.hasAirConditioning
                          ? "text-gray-200"
                          : "text-gray-800"
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
                sendWhatsAppMessage(schedule);
              }}
              className={`hover:text-amber-200 transition-colors ease-in-out duration-200`}
              title="Computador"
            >
              <MailCheck />
            </button>
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
