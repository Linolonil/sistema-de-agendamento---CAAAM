import { useContext, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { ScheduleContext } from "./../context/SchedulesContext";
import { PropTypes } from 'prop-types';

const TABLE_HEAD = ["Sala", "Nome do Advogado", "OAB", "Tipo de Agendamento"];

function Rooms() {
  const { schedules, availableRooms, confirmSchedule, loading, error, setRoomId } = useContext(ScheduleContext);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Estado para a sala selecionada

  // Unir e ordenar as salas ocupadas e disponíveis
  const allRooms = [
    ...schedules.map((schedule) => ({
      roomId: schedule._id,
      roomNumber: schedule.roomId.number,
      lawyerName: schedule.lawyerId.name,
      oab: schedule.lawyerId.oab,
      confirmed: schedule.confirmed,
      eventType: schedule.type === "meeting" ? "Reunião" : "Audiência",
      isOccupied: true,
    })),
    ...availableRooms.map((room) => ({ // Alteração aqui
      roomId: room._id, // Aqui estamos acessando o _id do objeto
      roomNumber: room.number, // Aqui estamos acessando o number do objeto
      lawyerName: null,
      oab: null,
      confirmed: false,
      eventType: "",
      isOccupied: false,
    })),
  ].sort((a, b) => a.roomNumber - b.roomNumber); // Ordenar todas as salas

  const handleConfirm = (roomId) => {
    confirmSchedule(roomId);
  };

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    setRoomId(roomId); // Passa o ID da sala selecionada corretamente
  };

  const renderRooms = () => {
    return allRooms.map((room) => (
      <tr
        key={room.roomId}
        onClick={() => handleRoomSelect(room.roomId)}
        className={`hover:bg-green-100 ${selectedRoomId === room.roomId ? "bg-green-200" : ""}`}
      >
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <Button
            className={`border rounded-[50px] p-1 w-full ${room.confirmed ? "bg-blue-500" : "bg-gray-600 text-white"}`}
            onClick={(e) => {
              e.stopPropagation(); // Impede a seleção da linha ao clicar no botão
              handleConfirm(room.roomId);
            }}
          >
            {room.roomNumber}
          </Button>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]">
            {room.isOccupied ? room.lawyerName : "Sala disponível"}
          </p>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px]">
            {room.isOccupied ? room.oab : ""}
          </p>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p className={`rounded w-2/3 text-white  ${room.eventType === "Reunião" ? "bg-blue-500" : room.eventType === "Audiência" ? "bg-red-600" : "text-gray-500"}`}>
            {room.eventType}
          </p>
        </td>
      </tr>
    ));
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRooms()}
        </tbody>
      </table>
    </Card>
  );
}

Rooms.propTypes = {
  onSelectRoom: PropTypes.func.isRequired,
};

export default Rooms;
