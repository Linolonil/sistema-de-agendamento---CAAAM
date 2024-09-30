import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Input, Button, Typography } from "@material-tailwind/react";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from "prop-types";

const CreateLawyerForm = ({ handleCreateUser }) => {
  const [lawyerData, setLawyerData] = useState({
    name: "",
    oab: "",
    phoneNumber: "",
  });
  const { createLawyer, setLawyer } = useContext(ScheduleContext);

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, oab, phoneNumber } = lawyerData;

    // Verifica se todos os campos foram preenchidos
    if (!name || !oab || !phoneNumber) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const response = await createLawyer(name, oab, phoneNumber);
      if (response.success) {
        setLawyer(response.lawyer._id);
        toast.success("Advogado cadastrado com sucesso!");
        handleCreateUser(); // Chama a função após o sucesso
      } else {
        toast.error("Advogado já cadastrado!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar advogado:", error);
      toast.error("Erro ao cadastrar advogado!");
    }
  };

  return (
      <form onSubmit={handleSubmit} className="p-1 mt-3">
        <div className="mb-4">
          <Typography variant="h6" className="text-black">Nome do Advogado</Typography>
          <Input
            type="text"
            size="lg"
            name="name"
            value={lawyerData.name}
            onChange={handleChange}
            placeholder="Nome do Advogado"
            required
            className="mt-2 bg-gray-700 border border-gray-600 text-black"
          />
        </div>

        <div className="mb-4">
          <Typography variant="h6" className="text-black">OAB</Typography>
          <Input
            type="text"
            size="lg"
            name="oab"
            value={lawyerData.oab}
            onChange={handleChange}
            placeholder="Informe a OAB"
            required
            className="mt-2 bg-gray-700 border border-gray-600 text-black"
          />
        </div>

        <div className="mb-4">
          <Typography variant="h6" className="text-black">Telefone com DDD</Typography>
          <Input
            type="tel"
            size="lg"
            name="phoneNumber"
            value={lawyerData.phoneNumber}
            onChange={handleChange}
            placeholder="Ex: 9299887766"
            required
            className="mt-2 bg-gray-700 border border-gray-600 text-black"
          />
        </div>

        <Button type="submit" color="green" className="mt-6 w-full bg-green-600 hover:bg-green-700">
          Cadastrar Advogado
        </Button>
      </form>
  );
};

// Define os tipos de props esperados
CreateLawyerForm.propTypes = {
  handleCreateUser: PropTypes.func.isRequired,
};

export default CreateLawyerForm;
