import { useState } from "react";
import { Card } from "@material-tailwind/react";
import Rooms from "./Rooms";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateLawyerForm from "./CreateLawyerForm";
import VerifyLawyerExist from "./verifyLawyerExist";

const SchedulingPage = () => {
    const [create, setCreate] = useState(false);

    const handleCreateUser = () => {
      setCreate(!create)
    };

    
  return (
    <Card className="p-6 w-full h-full mx-auto flex flex-wrap border gap-6">
      <div className="w-full lg:w-1/2">
        <Rooms/>
      </div>
      <div className="w-full lg:w-1/2">
      {!create ? (
        <>
        <VerifyLawyerExist />
        <CreateScheduleForm handleCreateUser={handleCreateUser}  />
        </>
      ) : (
        <CreateLawyerForm handleCreateUser={handleCreateUser} />
      )}   
      </div>

      
    </Card>
  );
};

export default SchedulingPage;
