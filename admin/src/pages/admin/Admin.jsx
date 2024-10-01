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
  Drawer,
  IconButton,
  AccordionHeader,
} from "@material-tailwind/react";

import {
  ChatBubbleLeftEllipsisIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  
} from "@heroicons/react/24/solid";

import logo from "../../assets/image/logocaaam.png";

import {
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Profile from "../../components/Profile";
import CreateSchedules from "../../components/CreateSchedules";
import ViewSchedules from "../../components/ViewSchedules";
import { BookA, ChevronRightIcon, UserCircleIcon, UserCog } from "lucide-react";
import ViewSchedulesStatus from "../../components/ViewSchedulesStatus";

const Admin = () => {
  const [activeSection, setActiveSection] = useState(null);
  const { signed, SignOut } = useContext(AuthContext);
  const [user, setUser] = useState({});

  const [open, setOpen] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
 
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
 

  useEffect(() => {
    const storedUser = localStorage.getItem("@Auth:user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    <div className="h-screen w-full bg-gray-800 flex justify-center items-center p-2 gap-2">
      <IconButton variant="text" color="white" size="lg" onClick={openDrawer} >
        {isDrawerOpen ? (
          <XMarkIcon className="h-full w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-full w-8 stroke-2" />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card color="transparent" shadow={false} className="h-[calc(100vh-2rem)] w-full p-4">
          <div className="mb-2 flex items-center gap-4 p-4">
            <img
      src={logo} alt="logo"
              className="h-auto w-full"
            />
          </div>
          <hr className=" border-gray-400" />

          <List>
              <ListItem className="p-0" selected={open === 1}>
                <ListItem
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
              <ListItemPrefix>
                <Avatar
                  size="md"
                  src={`http://localhost:5000/images/${user.iconProfile}`}
                />
              </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    {user?.name?.split(" ")[0]} - {user?.role === "admin" ? "Administrador" : "Estágiario"}
                  </Typography>
                </ListItem>
              </ListItem>

              <ListItem onClick={() => setActiveSection("profile")}>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Perfil
              </ListItem>
              
            <Accordion
              open={open === 2}
              data-selected={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 2}>
                <AccordionHeader
                  onClick={() => handleOpen(2)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                  <BookA />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Agendamentos
                  </Typography>
                </AccordionHeader>
              </ListItem>
              
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={() => setActiveSection("create-schedule")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Criar agendamento
                  </ListItem>
                  <ListItem onClick={() => setActiveSection("view-schedules")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Buscar agendamento
                  </ListItem>
                  <ListItem onClick={() => setActiveSection("view-schedules-status")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Dados 
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>

            {/* Somente o admin pode ter acesso a essa seção */}
            {user.role === "admin" && <Accordion
              open={open === 3}
              data-selected={open === 3}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 3}>
                <AccordionHeader
                  onClick={() => handleOpen(3)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                  <UserCog />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Controle de Usuários
                  </Typography>
                </AccordionHeader>
              </ListItem>
              
              <AccordionBody className="py-1">
                <List className="p-0">
                  <ListItem onClick={() => setActiveSection("create-schedule")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Criar novo usuário
                  </ListItem>
                  <ListItem onClick={() => setActiveSection("view-schedules")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Alterar dados do usuário
                  </ListItem>
                  <ListItem onClick={() => setActiveSection("view-schedules")}
                  >
                    <ListItemPrefix>
                      <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                    </ListItemPrefix>
                    Lista de usuários
                  </ListItem>
                </List>
              </AccordionBody>
            </Accordion>
          }            
            {/* <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Configurações
            </ListItem> */}
            <ListItem
            onClick={handleWhatsAppRedirect}
          >
            <ListItemPrefix>
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
            </ListItemPrefix>
            Suporte
          </ListItem>
          <ListItem onClick={handleLogout}>
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
      </Drawer>
      <Card className="h-full w-full mx-auto " color="gray">
        {activeSection === "profile" && <Profile user={user} />}
        {activeSection === "create-schedule" && <CreateSchedules />}
        {activeSection === "view-schedules" && <ViewSchedules />}
        {activeSection === "view-schedules-status" && <ViewSchedulesStatus />}
        {!activeSection && (
          <ViewSchedulesStatus/>
        )}
      </Card>
    </div>
  );
};

export default Admin;


