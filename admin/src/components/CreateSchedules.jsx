import { useState } from "react";
import { Card } from "@material-tailwind/react";
import Rooms from "./Rooms";
import CreateScheduleForm from "./CreateScheduleForm";

const SchedulingPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  return (
    <Card className="p-6 w-full h-full mx-auto flex flex-wrap border gap-6">
      <div className="w-full lg:w-1/2">
        <Rooms onSelectRoom={setSelectedRoomId} />
      </div>
      <div className="w-full lg:w-1/2">
        <CreateScheduleForm roomId={selectedRoomId} />
      </div>
    </Card>
  );
};

export default SchedulingPage;
