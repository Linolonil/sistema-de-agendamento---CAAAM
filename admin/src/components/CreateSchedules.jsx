import {  Card, CardBody, CardHeader, Tab, TabPanel, Tabs, TabsBody, TabsHeader} from "@material-tailwind/react";
import Rooms from "./Rooms";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateLawyerForm from "./CreateLawyerForm";
import VerifyLawyerExist from './VerifyLawyerExist';
import { useState } from "react";

const SchedulingPage = () => {
  const [type, setType] = useState("agendamento");

 
  return (
    <Card className=" w-full h-full mx-auto flex justify-center items-center flex-row    bg-dark ">
      <div className="w-full lg:w-2/3">
        <Rooms/>
      </div>
      <Card className="w-full  h-full">
      <CardBody>
      <CardHeader
        color="gray"
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center p-4 text-center"
      >
        <VerifyLawyerExist />
        
      </CardHeader>
        <Tabs value={type} className="overflow-visible mt-3">
          <TabsHeader className="relative z-0 ">
            <Tab value="agendamento" onClick={() => setType("agendamento")}>
              criarAgendamento
            </Tab>
            <Tab value="audiencia" onClick={() => setType("audiencia")}>
              Criar Advogado
            </Tab>
          </TabsHeader>
          <TabsBody
            className="!overflow-x-hidden !overflow-y-visible"
            animate={{
              initial: {
                x: type === "agendamento" ? 400 : -400,
              },
              mount: {
                x: 0,
              },
              unmount: {
                x: type === "agendamento" ? 400 : -400,
              },
            }}
          >
            <TabPanel value="agendamento" className="p-0">
            <CreateScheduleForm />
            </TabPanel>

            {/* asl,adsl,asld,las,dla,slda,ld */}
            <TabPanel value="audiencia" className="p-0">
             <CreateLawyerForm/>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>

      
    </Card>
  );
};

export default SchedulingPage;
