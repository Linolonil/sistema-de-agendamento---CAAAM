
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Card,
  CardBody,
  Typography,
  Menu,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {  ChevronUpIcon, DownloadIcon } from "lucide-react";
import api from '../../services/api';
import { useEffect, useState } from "react";
import { PropTypes } from 'prop-types';

// Componente do cartão KPI
export const KpiCard = ({ title, percentage, price, color, icon }) => {
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <Typography className="!font-medium !text-xs text-gray-600">{title}</Typography>
          <div className="flex items-center gap-1">
            {icon}
            <Typography color={color} className="font-medium !text-xs">{percentage}</Typography>
          </div>
        </div>
        <Typography color="blue-gray" className="mt-1 font-bold text-2xl">{price}</Typography>
      </CardBody>
    </Card>
  );
};

function ViewSchedulesStatus() {
  const [data, setData] = useState([]);
  const [kpiData, setKpiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/schedules/data');
        const { totalAgendamentos, totalAdvogadosCadastrados, totalMeetings, totalHearings, monthlyAgendamentos } = response.data;
        console.log(response.data);

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
          ];
          
          const monthlyData = monthlyAgendamentos.map(item => ({
            name: `${months[item._id.month - 1]}`, // Exibe o nome do mês e o ano
            value: item.total // Total de agendamentos do mês
          }));

        setData(monthlyData);

        // Definindo os KPIs
        setKpiData([
          {
            title: "Agendamentos de Hoje",
            price: totalAgendamentos,
            color: "red",
            icon: <DownloadIcon strokeWidth={4} className="w-3 h-3 text-red-500" />,
          },
          {
            title: "Advogados Cadastrados",
            price: totalAdvogadosCadastrados,
            color: "green",
            icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
          },
          {
            title: "Total de Reuniões",
            price: totalMeetings,
            color: "green",
            icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
          },
          {
            title: "Audiências Realizadas",
            price: totalHearings,
            color: "red",
            icon: <ChevronUpIcon strokeWidth={4} className="w-3 h-3 text-green-500" />,
          },
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full min-h-full shadow-md border border-gray-200 rounded-lg flex justify-center items-center">
      <CardBody className="p-6">
        <Typography variant="h5" className="mb-4">Status dos Agendamentos</Typography>

        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4bc0c0" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="shrink-0 mt-4">
          <Menu>
            <MenuList>
              <MenuItem>Segunda</MenuItem>
              <MenuItem>Terça</MenuItem>
              <MenuItem>Quarta</MenuItem>
              <MenuItem>Quinta</MenuItem>
              <MenuItem>Sexta</MenuItem>
            </MenuList>
          </Menu>
        </div>

        <div className="mt-6 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center md:gap-2.5 gap-4">
          {kpiData.map((props, key) => (
            <KpiCard key={key} {...props} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

KpiCard.propTypes = {
    title: PropTypes.string.isRequired,
    percentage: PropTypes.string.isRequired, 
    price: PropTypes.string.isRequired,      
    color: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,         
  };
  

export default ViewSchedulesStatus;
