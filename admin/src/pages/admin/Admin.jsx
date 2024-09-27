import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  List,
  Card,
  Avatar,
  ListItem,
  Accordion,
  Typography,
  AccordionBody,
  ListItemPrefix,
} from "@material-tailwind/react";

import {
  RectangleGroupIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";

import logo from "../../assets/image/logocaaam.png";

import {
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Profile from "../../components/Profile";
import CreateSchedules from "../../components/CreateSchedules";
import ViewSchedules from "../../components/ViewSchedules";

const Admin = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { signed, SignOut } = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("@Auth:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const LIST_ITEM_STYLES =
    "text-gray-500 hover:text-white focus:text-white active:text-white hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-20";

  const handleWhatsAppRedirect = () => {
    const phoneNumber = "5592985515439";
    const message = "Olá, estou precisando de um suporte no site!";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  if (!signed) {
    return <Navigate to="/login" />;
  }

  // Handle logout
  const handleLogout = () => {
    SignOut();
  };

  return (
    <div className="h-screen w-full bg-gray-800 flex justify-center items-center p-2">
      <Card
        className="h-[calc(100vh-2rem)] w-1/2 max-w-[20rem] mx-auto p-6 shadow-md"
        color="gray"
      >
        <div className="mb-2 flex items-center gap-4 p-4">
          <img src={logo} alt="logo" className="h-auto w-full" />
        </div>
        <hr className="my-2 border-gray-800" />
        <List>
          <Accordion open={open === 1}>
            <ListItem
              selected={open === 1}
              data-selected={open === 1}
              onClick={() => handleOpen(1)}
              className="p-3 hover:bg-opacity-20 text-gray-500 select-none focus:bg-opacity-20 active:bg-opacity-20 data-[selected=true]:bg-gray-50/20 hover:text-white focus:text-white active:text-white data-[selected=true]:text-white"
            >
              <ListItemPrefix>
                <Avatar
                  size="sm"
                  src="https://www.material-tailwind.com/img/avatar1.jpg"
                />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal text-inherit">
                {user.name ? user.name : "Usuário"}
              </Typography>
              <ChevronDownIcon
                strokeWidth={3}
                className={`ml-auto text-gray-500 h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  className={LIST_ITEM_STYLES}
                  onClick={() => setActiveSection("profile")}
                >
                  Meu Perfil
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <hr className="my-2 border-gray-800" />
          <Accordion open={open === 2}>
            <ListItem
              selected={open === 2}
              data-selected={open === 2}
              onClick={() => handleOpen(2)}
              className="px-3 py-[9px] hover:bg-opacity-20 text-gray-500 select-none focus:bg-opacity-20 active:bg-opacity-20 data-[selected=true]:bg-gray-50/20 hover:text-white focus:text-white active:text-white data-[selected=true]:text-white"
            >
              <ListItemPrefix>
                <RectangleGroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-normal text-inherit">
                Agendamento
              </Typography>
              <ChevronDownIcon
                strokeWidth={3}
                className={`ml-auto text-gray-500 h-4 w-4 transition-transform ${
                  open === 2 ? "rotate-180" : ""
                }`}
              />
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem
                  className={LIST_ITEM_STYLES}
                  onClick={() => setActiveSection("create-schedule")}
                >
                  Criar agendamento
                </ListItem>
                <ListItem
                  className={LIST_ITEM_STYLES}
                  onClick={() => setActiveSection("view-schedules")}
                >
                  Buscar todos os agendamentos
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
        </List>
        <hr className="my-2 border-gray-800" />
        <List>
          <ListItem
            className={LIST_ITEM_STYLES}
            onClick={handleWhatsAppRedirect}
          >
            <ListItemPrefix>
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
            </ListItemPrefix>
            Suporte
          </ListItem>
          <ListItem className={LIST_ITEM_STYLES} onClick={handleLogout}>
            <ListItemPrefix>
              <ArrowLeftStartOnRectangleIcon
                strokeWidth={2.5}
                className="h-5 w-5"
              />
            </ListItemPrefix>
            Sair
          </ListItem>
        </List>
      </Card>
      <Card className="h-[calc(100vh-2rem)] w-3/4 mx-auto " color="gray">
        {activeSection === "profile" && <Profile user={user} />}
        {activeSection === "create-schedule" && <CreateSchedules />}
        {activeSection === "view-schedules" && <ViewSchedules />}
        {!activeSection && (
          <viewSchedulesStatus/>
        )}
      </Card>
    </div>
  );
};

export default Admin;
