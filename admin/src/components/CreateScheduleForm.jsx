import { toast } from "react-toastify";
import { Card, Button, Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from "prop-types";
import { useContext } from "react";

const CreateScheduleForm = ({ handleCreateUser, }) => {
  const { updateDateAndHour, createSchedule, roomId, lawyer, userId, date, setDate,horario, setHorario, tipoAgendamento,setTipoAgendamento} = useContext(ScheduleContext);
 
  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    updateDateAndHour(formattedDate, horario);
  };
  const handleHorarioChange = (e) => {
    const selectedHorario = e;
    setHorario(selectedHorario);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      updateDateAndHour(formattedDate, selectedHorario);
    }
  };
  
  const handleCreateUserForm = () => {
    handleCreateUser()
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = date.toISOString().split("T")[0];

    if (roomId === null) {
        toast.info("Selecione uma sala!");
        return;
    }

    // Adiciona verificação de segurança para lawyer
    if (!lawyer || !lawyer.lawyer) {
        toast.error("Advogado não encontrado!");
        return;
    }

    try {
        const response = await createSchedule({
            date: formattedDate,
            hour: horario,
            roomId,
            lawyerId: lawyer.lawyer._id, // Acesso seguro
            userId,
            type: tipoAgendamento
        });
        return response;

    } catch (error) {
        console.log(error);
        toast.error("Erro ao criar agendamento!");
        return;
    }
};


  return (
    <Card color="transparent" shadow={false} className="p-6 w-full">
      <Typography variant="h4" color="blue-gray" className="text-center mb-6">
        Criar Agendamento
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap w-full">
          <div className="w-1/2 mb-4">
            <Typography variant="h6" color="blue-gray">Data</Typography>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              locale={ptBR}
              required
            />
          </div>

          <div className="w-1/2 mb-4">
            <Typography variant="h6" color="blue-gray">Horário</Typography>
            <select
              value={horario}
              onChange={(e) => handleHorarioChange(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded"
              required
            >
              {/* Opções de horários */}
              {["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <Typography variant="h6" color="blue-gray">Tipo de Agendamento</Typography>
          <Button
            onClick={() => setTipoAgendamento(tipoAgendamento === "meeting" ? "hearing" : "meeting")}
            className={`w-full px-4 py-2 mt-2 rounded text-white ${tipoAgendamento === "meeting" ? "bg-blue-500" : "bg-red-500"}`}
          >
            {tipoAgendamento === "meeting" ? "Reunião" : "Audiência"}
          </Button>
        </div>        

        <Button type="submit" color="green" className="mt-6 w-full" disabled={!lawyer}>
          Criar Agendamento
        </Button>
      </form>

      <Typography onClick={handleCreateUserForm} className="text-center mt-6 text-blue-500 cursor-pointer">
        Criar advogado
      </Typography>
    </Card>
  );
};

CreateScheduleForm.propTypes = {
  roomId: PropTypes.string.isRequired,
  lawyer: PropTypes.object.isRequired,
  onLawyerCreated: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
};

export default CreateScheduleForm;
