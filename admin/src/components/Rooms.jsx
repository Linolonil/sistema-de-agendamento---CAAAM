import { useContext, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { ScheduleContext } from "./../context/SchedulesContext";
import { TrashIcon } from "lucide-react";

const TABLE_HEAD = ["Sala", "Ocupante", "OAB", "Tipo", "Excluir"];

function Rooms() {
  const { schedules, availableRooms, confirmSchedule, loading, error, setRoomId, deleteSchedule } = useContext(ScheduleContext);
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
    ...availableRooms.map((room) => ({
      roomId: room._id,
      roomNumber: room.number,
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
        className={`cursor-pointer transition-colors duration-300 hover:bg-gray-200  ${selectedRoomId === room.roomId ? "bg-green-200 border" : ""}`}
      >
        <td className="border-b border-blue-gray-100 p-2 text-center">
          <Button
            className={`flex justify-center items-center rounded-full w-10 h-10 border text-black text-xl font-bold text-center ${room.confirmed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"}`}
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm(room.roomId);
            }}
          >
            {room.roomNumber}
          </Button>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p 
            className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[140px]" 
            title={room.isOccupied ? room.lawyerName : ""}
          >
            {room.isOccupied ? room.lawyerName : ""}
          </p>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px] text-center">
            {room.isOccupied ? room.oab : ""}
          </p>
        </td>
        <td className="border-b border-blue-gray-100 p-3 text-center">
          <p className={`rounded-full p-1 text-white ${room.eventType === "Reunião" ? "bg-blue-500" : room.eventType === "Audiência" ? "bg-red-600" : "text-gray-500"}`}>
            {room.eventType || ""}
          </p>
        </td>
        <td className="border-b border-blue-gray-100 text-center">
          <Button onClick={ () => deleteSchedule(room.roomId)}>
            <TrashIcon className="size-4 text-red-300 " />
          </Button>
        </td>
      </tr>
    ));
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <Card className="h-full w-full overflow-auto">
      <table className="w-full overflow-hidden h-full table-auto text-left">
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

export default Rooms;
