import { toast } from "react-toastify";
import { Button, Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from "prop-types";
import { useContext } from "react";

const getCurrentDateAndHour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adiciona 0 se necessário
  const day = String(date.getDate()).padStart(2, "0");
  const newDate = `${year}-${month}-${day}`;
  return newDate;
};

const CreateScheduleForm = () => {
  const {
    updateDate,
    createSchedule,
    roomId,
    lawyer,
    userId,
    date,
    setDate,
    horario,
    setHorario,
    tipoAgendamento,
    setTipoAgendamento,
  } = useContext(ScheduleContext);

  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = getCurrentDateAndHour(date);
    updateDate(formattedDate, horario);
  };
  const handleHorarioChange = (e) => {
    const selectedHorario = e;
    setHorario(selectedHorario);
    if (date) {
      const formattedDate = getCurrentDateAndHour(date);
      updateDate(formattedDate, selectedHorario);
    }
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
        lawyerId: lawyer.lawyer._id, 
        userId,
        type: tipoAgendamento,
      });
      return response;
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar agendamento!");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 mt-3 h-full w-full ">
        <div className="mb-4 ">
          <Typography variant="h6" className="text-gray-900">
            Data
          </Typography>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            className=" w-full mt-2 bg-gray-300   text-gray-900 text-center text-xl py-2 rounded"
            locale={ptBR}
            required
          />
        </div>

        <div className="mb-4">
          <Typography variant="h6" className="text-black">
            Hora
          </Typography>
          <select
            value={horario}
            onChange={(e) => handleHorarioChange(e.target.value)}
            className=" w-full mt-2 bg-gray-300   text-gray-900 text-center text-xl py-2 rounded"
            required
          >
            {[
              "8:00",
              "9:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
 
      <div className="mb-4">
        <Typography variant="h6" className="text-black">
          Tipo de Agendamento
        </Typography>
        <div className="flex items-center gap-4">
          <Button
            onClick={() =>
              setTipoAgendamento(
                tipoAgendamento === "meeting" ? "hearing" : "meeting"
              )
            }
            className={`w-full px-4 py-2 mt-2 rounded text-white ${
              tipoAgendamento === "meeting"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {tipoAgendamento === "meeting" ? "Reunião" : "Audiência"}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!lawyer}
        className="mt-4  w-full bg-green-600 hover:bg-green-700 "
      >
        Agendar
      </Button>
    </form>
  );
};

CreateScheduleForm.propTypes = {
  handleCreateUser: PropTypes.func.isRequired,
};

export default CreateScheduleForm;
