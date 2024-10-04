import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner, // Importa o Spinner para exibir o loading
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import ScheduleContext from "../context/SchedulesContext";
import { toast } from "react-toastify";
import api from "../services/api";

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
  
  // Estado para controlar o loading
  const [loading, setLoading] = useState(false);

  // Estados para controlar os campos do formulário
  const [newName, setNewName] = useState("");
  const [newOab, setNewOab] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleOpen = () => {
    if (open) {
      // Limpa os campos quando o diálogo é fechado
      resetForm();
      setLawyerName(""); // Limpa o nome exibido
      setTelefone(""); // Limpa o telefone exibido
      setTempOab(""); // Limpa a OAB exibida
    }
    setOpen(!open);
  };

  const resetForm = () => {
    setNewName(""); // Limpa o nome
    setNewOab("");  // Limpa a OAB
    setNewPhoneNumber(""); // Limpa o telefone
  };

  const handleSearchLawyer = async () => {
    if (!tempOab) {
      toast.error("Por favor, informe a OAB para buscar o advogado!");
      return;
    }
    
    setOab(tempOab); // Atualiza o estado da OAB
    setLoading(true); // Inicia o loading

    try {
      const lawyerResponse = await getLawyerByOab(tempOab);
      setLoading(false); // Finaliza o loading

      if (lawyerResponse.success) {
        setLawyer(lawyerResponse);
        setLawyerName(lawyerResponse?.lawyer.name);
        setTelefone(lawyerResponse?.lawyer.phoneNumber);
        setLawyerFound(true);
        // Atualiza os campos do formulário com os dados do advogado encontrado
        setNewName(lawyerResponse?.lawyer.name);
        setNewOab(lawyerResponse?.lawyer.oab);
        setNewPhoneNumber(lawyerResponse?.lawyer.phoneNumber);
        toast.dismiss();
        toast.success("Advogado encontrado!");
      } else {
        setLawyerFound(false);
        toast.dismiss();
        resetForm(); // Limpa os campos se o advogado não for encontrado
        setLawyerName(""); // Limpa o nome exibido
        setTelefone(""); // Limpa o telefone exibido
        toast.info("Advogado não encontrado. Será necessário cadastrá-lo.");
      }
    } catch (error) {
      setLoading(false); // Finaliza o loading em caso de erro
      console.log(error);
      toast.dismiss();
      toast.error("Erro ao buscar advogado. Tente novamente.");
    }
  };

  const handleUpdateLawyer = async () => {
    setLoading(true); // Inicia o loading

    try {
      const updates = {};
      if (newName && newName !== lawyer.lawyer.name) {
        updates.name = newName;
      }
      if (newOab && newOab !== lawyer.lawyer.oab) {
        updates.oab = newOab;
      }
      if (newPhoneNumber && newPhoneNumber !== lawyer.lawyer.phoneNumber) {
        updates.phoneNumber = newPhoneNumber;
      }

      // Verifica se há atualizações a serem feitas
      if (Object.keys(updates).length === 0) {
        toast.info("Nenhuma alteração realizada.");
        setLoading(false); // Finaliza o loading
        return; // Retorna se não houver atualizações
      }

      const response = await api.put(`/api/v1/lawyer/${lawyer?.lawyer._id}`, updates);
      const data = response.data;
      
      setLoading(false); // Finaliza o loading
      
      if (data.success) {
        toast.success("Dados do advogado atualizados com sucesso!");
        setLawyerName(newName);
        setTempOab(newOab);
        setTelefone(newPhoneNumber);
        // Limpa o campo de OAB de pesquisa após a atualização
        setTempOab(""); // Adicione esta linha
        handleOpen();
      } else {
        toast.error("Erro ao atualizar os dados. Verifique as informações.");
      }
    } catch (error) {
      setLoading(false); // Finaliza o loading em caso de erro
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
          disabled={loading} // Desabilita o botão durante o loading
        >
          {loading ? (
            <Spinner className="animate-spin h-5 w-5" /> // Exibe o loading
          ) : (
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
          )}
        </Button>
      </div>

      <div className="text-sm font-bold text-gray-100 w-full">
        {lawyerFound ? (
          <div
            className="w-full h-13 flex flex-col items-start"
            onClick={handleOpen}
          >
            <Typography title={lawyerName}>
              Nome:{" "}
              {lawyerName.length > 20
                ? lawyerName.substring(0, 20) + "..."
                : lawyerName}
            </Typography>
            <Typography title={telefone}>Cel: {telefone}</Typography>
          </div>
        ) : (
          <div className="w-full h-13 flex flex-col items-start text-start">
            <Typography>Nome: </Typography>
            <Typography>Cel: </Typography>
          </div>
        )}
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Atualizar Advogado</DialogHeader>
        <DialogBody>
          <form className="p-1 mt-3">
            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                Nome do Advogado
              </Typography>
              <div className="flex flex-col">
                <span className="text-gray-500">Anterior: {lawyer?.lawyer.name}</span>
                <Input
                  type="text"
                  size="lg"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome do Advogado"
                  required
                  className="mt-2 bg-gray-700 border border-gray-600 text-black"
                  disabled={loading} // Desabilita o campo durante o loading
                />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                OAB do Advogado
              </Typography>
              <div className="flex flex-col">
                <span className="text-gray-500">Anterior: {lawyer?.lawyer.oab}</span>
                <Input
                  type="text"
                  size="lg"
                  value={newOab}
                  onChange={(e) => setNewOab(e.target.value)}
                  placeholder="OAB do Advogado"
                  required
                  className="mt-2 bg-gray-700 border border-gray-600 text-black"
                  disabled={loading} // Desabilita o campo durante o loading
                />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="h6" className="text-black">
                Telefone do Advogado
              </Typography>
              <div className="flex flex-col">
                <span className="text-gray-500">Anterior: {lawyer?.lawyer.phoneNumber}</span>
                <Input
                  type="text"
                  size="lg"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="Telefone do Advogado"
                  required
                  className="mt-2 bg-gray-700 border border-gray-600 text-black"
                  disabled={loading} // Desabilita o campo durante o loading
                />
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            disabled={loading} // Desabilita o botão durante o loading
          >
            Cancelar
          </Button>
          <Button
            color="green"
            onClick={handleUpdateLawyer}
            disabled={loading} // Desabilita o botão durante o loading
          >
            {loading ? (
              <Spinner className="animate-spin h-5 w-5" /> // Exibe o loading
            ) : (
              "Atualizar"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default VerifyLawyerExist;
