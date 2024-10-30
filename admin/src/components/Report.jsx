import { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/schedules/report/monthly');
        setReportData(response.data);
      } catch (err) {
        setError('Erro ao buscar dados do relatório.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { report, summary } = reportData;

  return (
    <div className="p-4 overflow-x-auto print-container">
      <h2 className="text-2xl font-bold mb-4">Relatório Mensal de Agendamentos - 2024</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Mês</th>
            <th className="border border-gray-200 px-4 py-2">Total de Agendamentos</th>
            <th className="border border-gray-200 px-4 py-2">Audiências</th>
            <th className="border border-gray-200 px-4 py-2">Reuniões</th>
            <th className="border border-gray-200 px-4 py-2">Observações</th>
          </tr>
        </thead>
        <tbody>
          {report.map((monthData) => (
            <tr key={monthData.month} className="hover:bg-gray-100">
              <td className="border border-gray-200 px-4 py-2">{getMonthName(monthData.month)}</td>
              <td className="border border-gray-200 px-4 py-2">{monthData.hearings + monthData.meetings}</td>
              <td className="border border-gray-200 px-4 py-2">{monthData.hearings || 0}</td>
              <td className="border border-gray-200 px-4 py-2">{monthData.meetings || 0}</td>
              <td className="border border-gray-200 px-4 py-2">{monthData.observations || 'Nenhuma observação disponível'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Resumo Geral</h3>
        <p>Total de Agendamentos no Ano: {summary.totalAppointments}</p>
        <p>{summary.finalObservations}</p>
      </div>

      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-container {
            padding: 0;
            margin: 0;
            width: 100%;
          }
          table {
            width: 100%;
            margin: auto;
          }
          th, td {
            padding: 8px;
            font-size: 12px;
            border: 1px solid #000;
          }
          h2 {
            text-align: center;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .mt-6, .summary {
            font-size: 14px;
            margin-top: 20px;
            text-align: left;
          }
          /* Remove estilos desnecessários */
          .no-print, header, footer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

// Função para obter o nome do mês
const getMonthName = (month) => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return monthNames[month - 1];
};

export default Report;
