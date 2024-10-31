import {
  Card,
  CardBody,
  Typography
} from "@material-tailwind/react";
import { ChevronUpIcon, DownloadIcon } from "lucide-react";
import { infoSchedules } from '../services/apiSchedules.js';
import { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Componente do cartão KPI
export const KpiCard = ({ title, price, icon }) => (
  <Card className="shadow-sm border border-gray-200 !rounded-lg w-full">
    <CardBody className="p-4">
      <div className="flex justify-between items-center">
        <Typography className="!font-medium !text-xs text-gray-600">{title}</Typography>
        <div className="flex items-center gap-1">
          {icon}
        </div>
      </div>
      <Typography color="blue-gray" className="mt-1 font-bold text-2xl">{price}</Typography>
    </CardBody>
  </Card>
);

KpiCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
};

function ViewSchedulesStatus() {
  const [kpiData, setKpiData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("@Auth:token");
        const user = JSON.parse(localStorage.getItem("@Auth:user"));
        const idUser = user?._id;
  
        if (!token || !idUser) {
          console.error('Token ou id do usuário não encontrado');
          return;
        }
  
        const response = await infoSchedules(token, idUser);
        const { totalAgendamentos, totalAdvogadosCadastrados, totalMeetings, totalHearings, totalScheduleFromUser } = response;

        // Dados para os KPIs
        setKpiData([
          {
            title: "Agendamentos",
            price: totalAgendamentos,
            color: "red",
            icon: <DownloadIcon strokeWidth={4} className="w-4 h-3 text-red-500" />,
          },
          {
            title: "Advogados Cadastrados",
            price: totalAdvogadosCadastrados,
            color: "green",
            icon: <ChevronUpIcon strokeWidth={4} className="w-4 h-3 text-green-500" />,
          },
          {
            title: "Total de Reuniões",
            price: totalMeetings,
            color: "green",
            icon: <ChevronUpIcon strokeWidth={4} className="w-4 h-3 text-green-500" />,
          },
          {
            title: "Audiências Realizadas",
            price: totalHearings,
            color: "red",
            icon: <ChevronUpIcon strokeWidth={4} className="w-4 h-3 text-green-500" />,
          },
          {
            title: `Agendamentos criados - ${user?.name?.split(" ")[0] || "Usuário"}`,
            price: totalScheduleFromUser,
            color: "red",
            icon: <ChevronUpIcon strokeWidth={4} className="w-4 h-3 text-green-500" />,
          }
        ]);

        // Dados para o gráfico de desempenho (exemplo de estrutura)
        setChartData([
          { name: "Agendamentos", value: totalAgendamentos },
          { name: "Reuniões", value: totalMeetings },
          { name: "Audiências", value: totalHearings },
          { name: "Criados por Usuário", value: totalScheduleFromUser },
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
  
    fetchData();
  }, []); // Dependências do useEffect

  return (
    <Card className="w-full min-h-full shadow-md border border-gray-200 rounded-lg flex flex-col justify-start items-center">
      <CardBody className="p-6 w-full">
        <Typography variant="h5" className="mb-4">Status dos Agendamentos</Typography>

        <div className="mt-6 grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
          {kpiData.map((props, index) => (
            <KpiCard key={index} {...props} />
          ))}
        </div>

        {/* Gráfico de Desempenho */}
        <div className="w-full h-64 mt-8">
          <Typography variant="h6" className="mb-2 text-gray-700">Desempenho</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export default ViewSchedulesStatus;
