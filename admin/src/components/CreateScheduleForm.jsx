import { toast } from "react-toastify";
import { Card, Button, Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from "prop-types";
import { useContext } from "react";
import VerifyLawyerExist from './VerifyLawyerExist';


const getCurrentDateAndHour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adiciona 0 se necessário
  const day = String(date.getDate()).padStart(2, '0');
  const newDate = `${year}-${month}-${day}`;
   return  newDate 
};

const CreateScheduleForm = ({ handleCreateUser, }) => {
  const { updateDateAndHour, createSchedule, roomId, lawyer, userId, date, setDate,horario, setHorario, tipoAgendamento,setTipoAgendamento} = useContext(ScheduleContext);
 
  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = getCurrentDateAndHour(date);
    updateDateAndHour(formattedDate, horario);
  };
  const handleHorarioChange = (e) => {
    const selectedHorario = e;
    setHorario(selectedHorario);
    if (date) {
      const formattedDate = getCurrentDateAndHour(date);
      updateDateAndHour(formattedDate, selectedHorario);
    }
  };
  
  const handleCreateUserForm = () => {
    handleCreateUser()
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = getCurrentDateAndHour(date);

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
      <Card color="transparent" shadow={false} className="p-5 w-full text-white rounded-lg">
          <Typography variant="h4" className="text-center mb-6 text-white">
              Criar Agendamento
          </Typography>
          <VerifyLawyerExist />
          <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap w-full">
                  <div className="w-1/2 mb-4 pr-2">
                      <Typography variant="h6" className="text-white">Data</Typography>
                      <DatePicker
                          selected={date}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          className="w-full shadow bg-dark text-white text-xl px-4 py-2 rounded "
                          locale={ptBR}
                          required
                      />
                  </div>

                  <div className="w-1/2 mb-4 pl-2">
                      <Typography variant="h6" className="text-white">Horário</Typography>
                      <select
                          value={horario}
                          onChange={(e) => handleHorarioChange(e.target.value)}
                          className="w-full shadow bg-dark text-white text-xl px-4 py-2 rounded"
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
                  <Typography variant="h6" className="text-white">Tipo de Agendamento</Typography>
                  <Button
                      onClick={() => setTipoAgendamento(tipoAgendamento === "meeting" ? "hearing" : "meeting")}
                      className={`w-full px-4 py-2 mt-2 rounded text-white ${tipoAgendamento === "meeting" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}`}
                  >
                      {tipoAgendamento === "meeting" ? "Reunião" : "Audiência"}
                  </Button>
              </div>

              <Button 
                  type="submit" 
                  color="green" 
                  className="mt-6 w-full bg-green-600 hover:bg-green-700" 
                  disabled={!lawyer}
              >
                  Criar Agendamento
              </Button>
          </form>

          <Typography 
              onClick={handleCreateUserForm} 
              className="text-center mt-6 text-white cursor-pointer hover:underline"
          >
              Criar advogado
          </Typography>
      </Card>
  );
}

CreateScheduleForm.propTypes = {

  handleCreateUser: PropTypes.func.isRequired,
};

export default CreateScheduleForm;
