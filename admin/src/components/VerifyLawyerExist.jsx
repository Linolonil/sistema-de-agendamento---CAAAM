import { Button, Input, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import ScheduleContext from "../context/SchedulesContext";
import { toast } from "react-toastify";
import { PropTypes } from 'prop-types';

function VerifyLawyerExist() {
    const { getLawyerByOab, setLawyer, setOab } = useContext(ScheduleContext);
    const [lawyerFound, setLawyerFound] = useState(false);
    const [lawyerName, setLawyerName] = useState("");
    const [tempOab, setTempOab] = useState("");
    const [telefone, setTelefone] = useState("");
    const [displayOab, setDisplayOab] = useState(""); // Estado separado para exibir a OAB

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
                setLawyerName(lawyerResponse.lawyer.name);
                setTelefone(lawyerResponse.lawyer.phoneNumber);
                setLawyerFound(true);
                setDisplayOab(tempOab); // Armazena a OAB para exibir
                toast.success("Advogado encontrado!");
            } else {
                setLawyerFound(false);
                setDisplayOab(""); // Limpa a OAB se não encontrado
                toast.info("Advogado não encontrado. Será necessário cadastrá-lo.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Erro ao buscar advogado. Tente novamente.");
        }
    };

    return (
        <>
            <Typography variant="h6" color="blue-gray" className="mb-2">OAB</Typography>
            <div className="mb-4 flex items-center gap-3">
                <Input
                    type="text"
                    size="lg"
                    value={tempOab}
                    onChange={(e) => setTempOab(e.target.value)}
                    placeholder="Informe a OAB"
                    required
                    className="h-auto mr-2 flex-grow"
                />
                <Button onClick={handleSearchLawyer} color="blue" className="h-auto w-auto text-center px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
                </Button>
            </div>
            <Typography className="text-sm font-bold text-gray-600" color="red-500" variant="small">
                {lawyerFound ? `Nome: ${lawyerName} OAB: ${displayOab} Cel: ${telefone}` : ""}
            </Typography>
        </>
    );
}

VerifyLawyerExist.propTypes = {
    onLawyerCreated: PropTypes.func.isRequired,
};

export default VerifyLawyerExist;
