import { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  CardHeader,
} from "@material-tailwind/react";
import ScheduleContext from "../context/SchedulesContext";
import { PropTypes } from 'prop-types';
import VerifyLawyerExist from "./VerifyLawyerExist";
import { toast } from "react-toastify";

export function ButtonView({ dateSchedule, room, hourSchedule }) {
    const { tipoAgendamento, setTipoAgendamento,createSchedule,userId,lawyer } = useContext(ScheduleContext);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Adicionei o estado loading

    const getCurrentDateAndHour = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Adiciona 0 se necessário
        const day = String(date.getDate()).padStart(2, "0");
        const newDate = `${year}-${month}-${day}`;
        return newDate;
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
  
        if (!room?._id) {
            toast.info("Selecione uma sala!");
            return;
        }
  
        // A variável lawyer precisa ser definida aqui, certifique-se de que você a tenha no contexto
        if (!lawyer || !lawyer.lawyer) {
            toast.error("Advogado não encontrado!");
            return;
        }
        try {
            setLoading(true);
            const response = await createSchedule({
                date: getCurrentDateAndHour(dateSchedule),
                hour: hourSchedule,
                roomId: room._id, 
                lawyerId: lawyer.lawyer._id, 
                userId, 
                type: tipoAgendamento,
            });

            console.log(response)
  
            if (response && response.success) {
                toast.success("Agendamento criado com sucesso!");
                return;
            } else {
                toast.error(`${response.message}`); 
            }
        } catch (error) {
            console.error("Erro:", error);
            const errorMessage = error.data?.message || "Erro ao criar agendamento!";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
  
    function formatDate(date) {
        if (!date) return ""; // Retorna string vazia se a data não for válida
  
        const d = new Date(date); // Converte para objeto Date
        const day = String(d.getDate()).padStart(2, '0'); // Obtém o dia com dois dígitos
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Obtém o mês (0-11) e adiciona 1, também com dois dígitos
        const year = d.getFullYear(); // Obtém o ano
  
        return `${year}/${month}/${day}`; // Retorna a data formatada
    }
  
    const handleOpen = () => setOpen(prev => !prev);
  
    return (
        <>
            <Button onClick={handleOpen}>+</Button>
            <Dialog open={open} size="xs" handler={handleOpen}>
                <div className="flex items-center justify-between">
                    <DialogHeader className="flex flex-col items-start">
                        <Typography className="mb-1" variant="h4">
                            Novo agendamento
                        </Typography>
                    </DialogHeader>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5"
                        onClick={handleOpen}
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <DialogBody>
                    <div className="grid mt-0 gap-3 bg-black">
                        <CardHeader
                            color="gray"
                            floated={false}
                            shadow={false}
                            className="m-0 grid place-items-center p-2 text-center rounded-sm"
                        >
                            <VerifyLawyerExist />
                        </CardHeader>
                    </div>
                    <div className="grid mt-3 gap-3">
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Sala
                        </Typography>
                        <Input label="Sala" value={room?.number} disabled />
                    </div>
                    <div className="grid mt-3 gap-3">
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Data
                        </Typography>
                        <Input label='Data' value={formatDate(dateSchedule)} disabled />
                    </div>
                    <div className="grid mt-3 gap-3">
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Hora
                        </Typography>
                        <Input label="Hora" value={hourSchedule} disabled />
                    </div>
                    <div className="grid mt-3 gap-3">
                        <Typography className="-mb-1" color="blue-gray" variant="h6">
                            Tipo de agendamento
                        </Typography>
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
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        Cancelar
                    </Button>
                    <Button variant="gradient" color="gray" onClick={handleSubmit} disabled={loading}>
                        Criar
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

ButtonView.propTypes = {
    dateSchedule: PropTypes.string, // Ou PropTypes.instanceOf(Date) se for um objeto Date
    room: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
    }),
    hourSchedule: PropTypes.string.isRequired,
};
