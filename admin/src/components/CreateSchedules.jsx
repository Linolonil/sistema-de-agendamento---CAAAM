import {
  Card,
  CardBody,
  CardHeader,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import Rooms from "./Rooms";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateLawyerForm from "./CreateLawyerForm";
import VerifyLawyerExist from "./VerifyLawyerExist";
import { useState } from "react";

const SchedulingPage = () => {
  const [type, setType] = useState("agendamento");


  

  return (
    <Card className=" w-full h-full p-1 gap-2 flex justify-between items-center flex-row bg-dark ">
      <div className="w-[74%]  h-full">
        <Rooms />
      </div>
      <Card className="w-[26%]  h-full">
        <CardBody>
          <CardHeader
            color="gray"
            floated={false}
            shadow={false}
            className="m-0 grid place-items-center p-2 text-center"
          >
            <VerifyLawyerExist />
          </CardHeader>
          <Tabs value={type} className="overflow-visible mt-3">
            <TabsHeader className="relative z-0 ">
              <Tab value="agendamento" onClick={() => setType("agendamento")}>
                Agendamento
              </Tab>
              <Tab value="audiencia" onClick={() => setType("audiencia")}>
                Advogado
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
              <TabPanel value="agendamento" className="p-0 w-full h-full ">
                <CreateScheduleForm />
              </TabPanel>

              {/* asl,adsl,asld,las,dla,slda,ld */}
              <TabPanel value="audiencia" className="p-0 w-full h-full ">
                <CreateLawyerForm />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </Card>
  );
};

export default SchedulingPage;
