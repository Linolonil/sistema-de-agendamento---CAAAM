import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale"; 
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from 'prop-types';

const CreateScheduleForm = ({ roomId }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [oab, setOab] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [horario, setHorario] = useState("8:00");
  const [telefone, setTelefone] = useState("");
  const [tipoAgendamento, setTipoAgendamento] = useState("meeting");
  const { updateDateAndHour, createSchedule, getLawyerByOab, createLawyer } = useContext(ScheduleContext);

  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    updateDateAndHour(formattedDate, horario || "8:00");
  };

  const userData = JSON.parse(localStorage.getItem("@Auth:user"));
  const userId = userData ? userData._id : null; 
  
  const handleHorarioChange = (e) => {
    const selectedHorario = e.target.value;
    setHorario(selectedHorario);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      updateDateAndHour(formattedDate, selectedHorario);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !telefone || !oab || !horario) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }
    
    const formattedDate = date.toISOString().split("T")[0];
    
    try {
      const lawyerResponse = await getLawyerByOab(oab);
console.log(lawyerResponse);
      if (lawyerResponse.success === false) {
        const newLawyer = { name, oab, phoneNumber: telefone }; 
        console.log(newLawyer)
        const createLawyerResponse = await createLawyer(newLawyer.name, newLawyer.oab, newLawyer.phoneNumber);
        console.log(createLawyerResponse);

        if (createLawyerResponse.success === true) {
          setLawyerId(createLawyerResponse.lawyer._id);
          toast.success("Advogado criado com sucesso!");
        } else {
          toast.error("Erro ao criar advogado!");
          return;
        }
      } else {
        setLawyerId(lawyerResponse.lawyer._id);
      }
      console.log(lawyerId, userId, roomId, formattedDate, horario, tipoAgendamento);
      await createSchedule(formattedDate, horario, roomId, lawyerId, userId, tipoAgendamento);
      
      if(createSchedule.success === true){
        setName("");
        setOab("");
        setTelefone("");
        toast.success("Agendamento criado com sucesso!");
      }
      return;

    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error(error.response ? error.response.data.message : "Erro ao criar agendamento!");
    }
  };

  const toggleAgendamento = () => {
    setTipoAgendamento((prev) => (prev === "meeting" ? "hearing" : "meeting"));
  };

  return (
    <Card color="transparent" shadow={false} className="p-6 w-full">
      <Typography variant="h4" color="blue-gray" className="text-center mb-6">
        Criar Agendamento
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap w-full">
          <div className="w-1/4 sm:w-1/2 mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">Data</Typography>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-2/3 border border-gray-300 px-4 py-2 rounded"
              placeholderText="Selecione uma data"
              required
              locale={ptBR}
            />
          </div>

          <div className="w-1/4 sm:w-1/2 mb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">Horário</Typography>
            <select
              value={horario}
              onChange={handleHorarioChange}
              required
              className="w-2/3 border border-gray-300 px-4 py-2 rounded"
            >
              <option value="8:00">08:00</option>
              <option value="9:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>  
              <option value="17:00">17:00</option>  
            </select>
          </div>
        </div>

        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">Tipo de Agendamento</Typography>
          <Button
            onClick={toggleAgendamento}
            className={`mt-2 w-full border px-4 py-2 rounded
              ${tipoAgendamento === "meeting" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}
              text-white`}
          >
            {tipoAgendamento === "meeting" ? "Reunião" : "Audiência"}
          </Button>
        </div>

        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">Nome</Typography>
          <Input
            size="lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do agendamento"
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

        <Button type="submit" color="blue" fullWidth className="mt-4">
          Criar Agendamento
        </Button>
      </form>
    </Card>
  );
};

CreateScheduleForm.propTypes = {
  roomId: PropTypes.string.isRequired,
};  

export default CreateScheduleForm;
