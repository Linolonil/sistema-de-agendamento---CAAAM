import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import ScheduleContext from "../context/SchedulesContext";
import { toast } from "react-toastify";
import api from "../services/api";
import { PropTypes } from "prop-types";

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
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOab, setNewOab] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleOpen = () => {
    if (open) resetForm();
    setOpen(!open);
  };

  const resetForm = () => {
    setNewName("");
    setNewOab("");
    setNewPhoneNumber("");
  };

  const validateOab = (oab) => /^[0-9]+$/.test(oab);

  const handleSearchLawyer = async () => {
    if (!tempOab) {
      toast.error("Por favor, informe a OAB para buscar o advogado!");
      return;
    }

    if (!validateOab(tempOab)) {
      toast.error("A OAB deve conter apenas números!");
      return;
    }

    setOab(tempOab);
    setLoading(true);

    try {
      const lawyerResponse = await getLawyerByOab(tempOab);
      setLoading(false);

      if (lawyerResponse.success) {
        setLawyer(lawyerResponse);
        setLawyerName(lawyerResponse?.lawyer?.name);
        setTelefone(lawyerResponse?.lawyer?.phoneNumber);
        setLawyerFound(true);
        setNewName(lawyerResponse?.lawyer?.name);
        setNewOab(lawyerResponse?.lawyer?.oab);
        setNewPhoneNumber(lawyerResponse?.lawyer?.phoneNumber);
        toast.success("Advogado encontrado!");
      } else {
        handleLawyerNotFound();
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Erro ao buscar advogado. Tente novamente.");
    }
  };

  const handleLawyerNotFound = () => {
    setLawyerFound(false);
    resetForm();
    setLawyerName("");
    setTelefone("");
    toast.info("Advogado não encontrado. Será necessário cadastrá-lo.");
  };

  const handleUpdateLawyer = async () => {
    setLoading(true);

    try {
      const updates = {};
      if (newName && newName !== lawyer?.lawyer.name) updates.name = newName;
      if (newOab && newOab !== lawyer?.lawyer.oab) updates.oab = newOab;
      if (newPhoneNumber && newPhoneNumber !== lawyer?.lawyer.phoneNumber)
        updates.phoneNumber = newPhoneNumber;

      if (Object.keys(updates).length === 0) {
        toast.info("Nenhuma alteração realizada.");
        setLoading(false);
        return;
      }

      const response = await api.put(
        `/api/v1/lawyer/${lawyer?.lawyer._id}`,
        updates
      );
      const data = response.data;
      setLoading(false);

      if (data.success) {
        toast.success("Dados do advogado atualizados com sucesso!");
        setLawyerName(newName);
        setTempOab(newOab);
        setTelefone(newPhoneNumber);
        handleOpen(); // Close dialog after update
      } else {
        toast.error("Erro ao atualizar os dados. Verifique as informações.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Erro no catch:", error);
      toast.error("Erro ao atualizar advogado. Tente novamente.");
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        color="white"
        className="w-full mb-2 flex justify-around items-center gap-20"
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
          disabled={loading}
        />
        <Button
          onClick={handleSearchLawyer}
          color="indigo"
          className="flex justify-center items-center h-full w-full text-center px-5"
          disabled={loading}
        >
          {loading ? (
            <Spinner className="animate-spin h-5 w-5" />
          ) : (
            <SearchIcon />
          )}
        </Button>
      </div>

      <LawyerDetails
        lawyerFound={lawyerFound}
        lawyerName={lawyerName}
        telefone={telefone}
        handleOpen={handleOpen}
      />

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Atualizar Advogado</DialogHeader>
        <DialogBody>
          <LawyerUpdateForm
            newName={newName}
            setNewName={setNewName}
            newOab={newOab}
            setNewOab={setNewOab}
            newPhoneNumber={newPhoneNumber}
            setNewPhoneNumber={setNewPhoneNumber}
            lawyer={lawyer}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            color="red"
            onClick={() => {
              resetForm(); 
              handleOpen(); 
            }}
            variant="text"
            className="mr-1"
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdateLawyer} disabled={loading}>
            Atualizar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

const SearchIcon = () => (
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
);

const LawyerDetails = ({ lawyerFound, lawyerName, telefone, handleOpen }) => (
  <div className="text-sm font-bold text-gray-100 w-full">
    {lawyerFound ? (
      <div
        className="w-full h-13 flex flex-col items-start"
        onClick={handleOpen}
      >
        <Typography title={lawyerName}>
          Nome:{" "}
          {lawyerName.length > 20
            ? `${lawyerName.substring(0, 20)}...`
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
);

const LawyerUpdateForm = ({
  newName,
  setNewName,
  newOab,
  setNewOab,
  newPhoneNumber,
  setNewPhoneNumber,
  lawyer,
}) => (
  <form className="p-1 mt-3">
    <Field
      title="Nome do Advogado"
      previous={lawyer?.lawyer?.name}
      value={newName}
      onChange={setNewName}
    />
    <Field
      title="OAB"
      previous={lawyer?.lawyer?.oab}
      value={newOab}
      onChange={setNewOab}
    />
    <Field
      title="Telefone"
      previous={lawyer?.lawyer?.phoneNumber}
      value={newPhoneNumber}
      onChange={setNewPhoneNumber}
    />
  </form>
);

const Field = ({ title, previous, value, onChange }) => (
  <div className="mb-4">
    <Typography variant="h6" className="text-black">
      {title} <span className="text-gray-400">(anterior: {previous})</span>
    </Typography>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

LawyerDetails.propTypes = {
  lawyerFound: PropTypes.bool.isRequired,
  lawyerName: PropTypes.string.isRequired,
  telefone: PropTypes.string.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

// Validations for LawyerUpdateForm component
LawyerUpdateForm.propTypes = {
  newName: PropTypes.string.isRequired,
  setNewName: PropTypes.func.isRequired,
  newOab: PropTypes.string.isRequired,
  setNewOab: PropTypes.func.isRequired,
  newPhoneNumber: PropTypes.string.isRequired,
  setNewPhoneNumber: PropTypes.func.isRequired,
  lawyer: PropTypes.shape({
    lawyer: PropTypes.shape({
      name: PropTypes.string,
      oab: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
  }),
};

// Validations for Field component
Field.propTypes = {
  title: PropTypes.string.isRequired,
  previous: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default VerifyLawyerExist;
