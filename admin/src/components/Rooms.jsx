import { useContext, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { ScheduleContext } from "./../context/SchedulesContext";
import { AirVent, Laptop, PersonStanding, TrashIcon, Tv } from "lucide-react";

const TABLE_HEAD = ["Sala", "Ocupante", "OAB", "Tipo", "Informações", "Qtnd.", "Excluir"];

function Rooms() {
  const { schedules, availableRooms, confirmSchedule, loading, error, setRoomId, deleteSchedule, changeRoomState } = useContext(ScheduleContext);
  const [selectedRoomId, setSelectedRoomId] = useState(null); // Estado para a sala selecionada
console.log(schedules)
  // Unir e ordenar as salas ocupadas e disponíveis
  const allRooms = [
    ...schedules.map((schedule) => ({
      roomId: schedule._id,
      roomNumber: schedule.roomId.number,
      lawyerName: schedule.lawyerId.name,
      oab: schedule.lawyerId.oab,
      confirmed: schedule.confirmed,
      hasAirConditioning: schedule.roomId.hasAirConditioning,
      hasTV: schedule.roomId.hasTV,
      hasComputer: schedule.roomId.hasComputer,
      capacity: schedule.roomId.capacity,
      eventType: schedule.type === "meeting" ? "Reunião" : "Audiência",
      isOccupied: true,
    })),
    ...availableRooms.map((room) => ({
      roomId: room._id,
      roomNumber: room.number,
      capacity: room.capacity,
      hasAirConditioning: room.hasAirConditioning,
      hasTV: room.hasTV,
      hasComputer: room.hasComputer,
      lawyerName: null,
      oab: null,
      confirmed: false,
      eventType: "",
      isOccupied: false,
    })),
  ].sort((a, b) => a.roomNumber - b.roomNumber); // Ordenar todas as salas
  console.log(allRooms)

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
      className={`cursor-pointer transition-colors duration-300 hover:bg-gray-200 ${
        selectedRoomId === room.roomId ? "bg-green-200 border" : ""
      }`}
    >
      <td  className="w-10 border-b border-blue-gray-100 p-2 text-center mx-auto">
  <Button
    className={`flex justify-center items-center rounded-full w-10 h-10 text-black text-xl font-bold text-center ${
      room.confirmed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-600"
    }`}
    onClick={(e) => {
      e.stopPropagation();
      handleConfirm(room.roomId);
    }}
  >
    {room.roomNumber}
  </Button>
      </td>
    
      <td className="border-b border-blue-gray-100 p-2 text-center">
        <p
          className="font-bold overflow-hidden text-ellipsis whitespace-nowrap"
          title={room.isOccupied ? room.lawyerName : ""}
        >
          {room.isOccupied ? room.lawyerName : "Disponível"}
        </p>
      </td>
    
      <td className="border-b border-blue-gray-100 p-2 text-center">
        <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[60px]">
          {room.isOccupied ? room.oab : ""}
        </p>
      </td>
    
      <td className="border-b border-blue-gray-100 p-2 text-center ">
        <p
          className={`rounded-full p-1 text-white ${
            room.eventType === "Reunião"
              ? "bg-blue-500"
              : room.eventType === "Audiência"
              ? "bg-red-600"
              : "bg-gray-500"
          }`}
        >
          {room.eventType || ""}
        </p>
      </td>
    
      <td className="   border-b border-blue-gray-100 text-center mx-auto ">
        <div className=" flex justify-center items-center gap-4">
        <p 
            onClick={() => changeRoomState(room.roomId, room.hasAirConditioning, !room.hasTV)}
            className={room.hasTV ? "text-gray-800" : "text-gray-200"} title="TV">
        <Tv  />

        </p>
        
        <p
            onClick={() => changeRoomState(room.roomId, !room.hasAirConditioning, room.hasTV)}
            className={room.hasAirConditioning ? "text-gray-800" : "text-gray-200"} title="Ar-Condicionado">
        <AirVent />
        </p>
        {/* to validando o controle do computador por aqui ex: room.roomNumber== 1 */}
        <p
                    onClick={() => changeRoomState(room.roomId, room.hasAirConditioning, room.hasTV, !room.hasComputer)}
            className={room.hasComputer ? "text-gray-800" : "text-gray-200"} title="Computador">
        <Laptop />
          </p>  

        
        </div>
      </td>
      <td className="   border-b border-blue-gray-100 text-center mx-auto ">
        <div className=" flex justify-center items-center text-gray-800" title="Quantidade de Pessoas na sala">
        <PersonStanding />
        <p className="text-gray-800 text-md font-bold">
        {room.capacity}
        </p>
        </div>
      </td>
      <td className="   border-b border-blue-gray-100 text-center mx-auto ">
          {room.isOccupied ?(
        <Button  onClick={() => deleteSchedule(room.roomId)} className="w-5 h-5  rounded-full relative bg-white shadow-none hover:text-white hover:scale-105 group">
          
            <TrashIcon className="size-4 absolute bottom-1 left-4 text-red-700" />
        </Button>
          ):("")}
      </td>
    </tr>
    
    ));
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="red">{error}</Typography>;

  return (
    <Card className="h-full w-full overflow-auto ">
      <table className="w-full overflow-hidden h-full table-auto text-center border-collapse">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center border">
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
