import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import ScheduleContext from "../context/SchedulesContext";
import { toast } from "react-toastify";
import api from "../../services/api";

function VerifyLawyerExist() {
  const {
    getLawyerByOab,
    setLawyer,
    setOab,
    lawyerName,
    tempOab,
    telefone,
    setLawyerName,
    setTempOab,
    setTelefone,
    lawyerFound,
    setLawyerFound,
    lawyer,
  } = useContext(ScheduleContext);
  const [open, setOpen] = useState(false);

  // Estados para controlar os campos do formulário
  const [newName, setNewName] = useState(lawyerName || null);
  const [newOab, setNewOab] = useState(tempOab || null);
  const [newPhoneNumber, setNewPhoneNumber] = useState(telefone || null);

  const handleOpen = () => setOpen(!open);

  const handleSearchLawyer = async () => {
    if (!tempOab) {
      toast.error("Por favor, informe a OAB para buscar o advogado!");
      return;
    }
    setOab(tempOab); // Atualiza o estado da OAB
    try {
      const lawyerResponse = await getLawyerByOab(tempOab);
      if (lawyerResponse.success) {
        setLawyer(lawyerResponse);
        setLawyerName(lawyerResponse?.lawyer.name);
        setTelefone(lawyerResponse?.lawyer.phoneNumber);
        setLawyerFound(true);
        toast.dismiss();
        toast.success("Advogado encontrado!");
      } else {
        setLawyerFound(false);
        toast.dismiss();
        toast.info("Advogado não encontrado. Será necessário cadastrá-lo.");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Erro ao buscar advogado. Tente novamente.");
    }
  };

  const handleUpdateLawyer = async () => {
    try {
      const response = await api.put(`/api/v1/lawyer/${lawyer?.lawyer._id}`, {
        name: newName,
        oab: newOab,
        phoneNumber: newPhoneNumber,
      });
      const data = response.data;
      
      if (data) {
        toast.success("Dados do advogado atualizados com sucesso!");
        setLawyerName(newName);
        setTempOab(newOab);
        setTelefone(newPhoneNumber);
        handleOpen(); 
        return;
      } else {
        toast.error("Erro ao atualizar os dados. Verifique as informações.");
      }
    } catch (error) {
      console.log("Erro no catch:", error); // Log para verificar o erro
      toast.error("Erro ao atualizar advogado. Tente novamente.");
    }
  };
  

  return (
    <>
      <Typography
        variant="h6"
        color="white"
        className="w-full mb-2 text flex justify-around items-center gap-20"
      >
        OAB
      </Typography>

      <div className="mb-4 flex items-center gap-5 w-full">
        <Input
          type="text"
          size="lg"
          value={tempOab}
          onChange={(e) => setTempOab(e.target.value)}
          placeholder="Informe a OAB"
          className="h-full text-white"
        />
        <Button
          onClick={handleSearchLawyer}
          color="indigo"
          className="flex justify-center items-center h-full w-full text-center px-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 w-full"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>

      <Typography
        className="text-sm font-bold text-gray-100 w-full"
        color="gray"
        variant="small"
      >
        {lawyerFound ? (
          <div className="w-full h-13 flex flex-col items-start" onClick={handleOpen}>
            <Typography title={lawyerName}>
              Nome: {lawyerName.length > 20 ? lawyerName.substring(0, 20) + "..." : lawyerName}
            </Typography>
            <Typography title={telefone}>Cel: {telefone}</Typography>
          </div>
        ) : (
          <div className="w-full h-13 flex flex-col items-start text-start">
            <Typography>Nome: </Typography>
            <Typography>Cel: </Typography>
          </div>
        )}
      </Typography>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Atualizar Advogado</DialogHeader>
        <DialogBody>
          <form className="p-1 mt-3">
            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                Nome do Advogado
              </Typography>
              <Input
                type="text"
                size="lg"
                value={!newName ? lawyer?.lawyer?.name : newName }
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do Advogado"
                required
                className="mt-2 bg-gray-700 border border-gray-600 text-black"
              />
            </div>

            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                OAB
              </Typography>
              <Input
                type="text"
                size="lg"
                value={!newOab ? lawyer?.lawyer?.oab : newOab}
                onChange={(e) => setNewOab(e.target.value)}
                placeholder="Informe a OAB"
                required
                className="mt-2 bg-gray-700 border border-gray-600 text-black"
              />
            </div>

            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                Telefone com DDD
              </Typography>
              <Input
                type="tel"
                size="lg"
                value={!newPhoneNumber ? lawyer?.lawyer?.phoneNumber : newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="Ex: 9299887766"
                required
                className="mt-2 bg-gray-700 border border-gray-600 text-black"
              />
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdateLawyer}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default VerifyLawyerExist;
