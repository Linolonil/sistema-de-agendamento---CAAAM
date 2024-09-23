import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from 'prop-types';

const CreateLawyerForm = ({ handleCreateUser }) => {
  const [lawyerName, setLawyerName] = useState("");
  const [telefone, setTelefone] = useState("");
  const { createLawyer, setLawyer, oab, setOab } = useContext(ScheduleContext);

  const handleCreateUserLawyer = () => {
    handleCreateUser()
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLawyer = { name: lawyerName, oab, phoneNumber: telefone };
      const response = await createLawyer(newLawyer.name, newLawyer.oab, newLawyer.phoneNumber);
      if (response.success) {
          setLawyer(response.lawyer._id);
          toast.success("Advogado cadastrado com sucesso!");
          handleCreateUserLawyer();
        return
      } else {
        toast.error("Advogado já cadastrado!");
        handleCreateUserLawyer();
        return
      }
    } catch (error) {
      console.log(error)
      toast.error("Erro ao cadastrar advogado!");
      return    
    }
  };

  return (
    <Card color="transparent" shadow={false} className="p-6 w-full">
      <Typography variant="h4" color="blue-gray" className="text-center mb-6">
        Cadastrar Advogado
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">Nome do Advogado</Typography>
          <Input
            type="text"
            size="lg"
            value={lawyerName}
            onChange={(e) => setLawyerName(e.target.value)}
            placeholder="Nome do Advogado"
            required
            className="mt-2"
          />
        </div>

        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">OAB</Typography>
          <Input
            type="text"
            size="lg"
            value={oab}
            onChange={(e) => setOab(e.target.value)}
            placeholder="Informe a OAB"
            required
            className="mt-2"
          />
        </div>

        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">Telefone</Typography>
          <Input
            type="tel"
            size="lg"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Informe o telefone"
            required
            className="mt-2"
          />
        </div>

        <Button type="submit" color="green" className="mt-6 w-full">
          Cadastrar Advogado
        </Button>
      </form>
      <Typography onClick={handleCreateUserLawyer} className="text-center mt-6 text-blue-500 cursor-pointer">
       Criar agendamento
      </Typography>
    </Card>
  );
};
CreateLawyerForm.propTypes = {
  onLawyerCreated: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
};  

export default CreateLawyerForm;
