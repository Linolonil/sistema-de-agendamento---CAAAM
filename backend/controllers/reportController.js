// controllers/ScheduleController.js
import Schedule from '../models/Schedule.js';

const getMonthlyAppointmentReport = async () => {
  const currentYear = new Date().getFullYear();

  try {
    // Contagem de agendamentos por mês, incluindo audiências e reuniões
    const monthlyCounts = await Schedule.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear, 0, 1), // 1º de janeiro do ano atual
            $lt: new Date(currentYear + 1, 0, 1) // 1º de janeiro do próximo ano
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" }, // Agrupa por mês
          total: { $sum: 1 }, // Conta o número total de agendamentos
          hearings: { $sum: { $cond: [{ $eq: ["$type", "hearing"] }, 1, 0] } }, // Conta audiências
          meetings: { $sum: { $cond: [{ $eq: ["$type", "meeting"] }, 1, 0] } } // Conta reuniões
        }
      },
      {
        $project: {
          _id: 1,
          total: 1,
          hearings: { $ceil: { $divide: ["$hearings", 3] } }, // Divide o total de audiências por 3 e arredonda para cima
          meetings: 1
        }
      },
      {
        $sort: { _id: 1 } // Ordena os meses
      }
    ]);
    
    console.log(monthlyCounts)

    // Cria um objeto para mapear os dados retornados
    const monthlyDataMap = monthlyCounts.reduce((acc, month) => {
      acc[month._id] = {
        total: month.total,
        hearings: month.hearings,
        meetings: month.meetings,
        observations: getObservations(month._id)
      };
      return acc;
    }, {});

    // Cria o relatório com todos os meses, preenchendo com dados zerados se não existir
    const report = [];
    for (let month = 1; month <= 12; month++) {
      const data = monthlyDataMap[month];
      report.push({
        month: month,
        total: data ? data.total : 0,
        hearings: data ? data.hearings : 0,
        meetings: data ? data.meetings : 0,
        observations: data ? data.observations : null // Observações apenas se houver dados
      });
    }

    // Cálculos para o resumo geral
    const totalHearings = report.reduce((sum, month) => sum + month.hearings, 0);
    const totalMeetings = report.reduce((sum, month) => sum + month.meetings, 0);
    const totalAppointments = totalMeetings + totalHearings;

    return {
      report,
      summary: {
        totalAppointments,
        totalHearings,
        totalMeetings,
        finalObservations: `O ano de ${currentYear} apresentou os seguintes agendamentos`,
      }
    };
  } catch (error) {
    console.error("Erro ao gerar o relatório de agendamentos:", error);
    throw error; // Lança o erro para ser tratado em outro lugar
  }
};

// Função para definir observações com base no mês
const getObservations = (month) => {
  switch (month) {
    case 1: return "Início do ano movimentado";
    case 2: return "Aumento na demanda";
    case 3: return "Mês regular";
    case 4: return "Eventos especiais";
    case 5: return "Alta procura";
    case 6: return "Mês muito ativo";
    case 7: return "Férias influenciaram";
    case 8: return "Retorno das atividades";
    case 9: return "Crescimento constante";
    case 10: return "Aumento significativo";
    case 11: return "Mês regular";
    case 12: return "Encerramento do ano";
    default: return "";
  }
};

export default {
  getMonthlyAppointmentReport
};
