import { useState } from "react";
import { Card } from "@material-tailwind/react";
import Rooms from "./Rooms";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateLawyerForm from "./CreateLawyerForm";

const SchedulingPage = () => {
    const [create, setCreate] = useState(false);

    const handleCreateUser = () => {
      setCreate(!create)
    };

    
  return (
    <Card className=" w-full h-full mx-auto flex justify-center items-center flex-row  gap-1  bg-dark ">
      <div className="w-full lg:w-2/3">
        <Rooms/>
      </div>
      <div className="w-full lg:w-1/3">
      {!create ? (
        <CreateScheduleForm handleCreateUser={handleCreateUser}  />
      ) : (
        <CreateLawyerForm handleCreateUser={handleCreateUser} />
      )}   
      </div>

      
    </Card>
  );
};

export default SchedulingPage;
