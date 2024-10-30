// routes/scheduleRoutes.js
import express from 'express';
import ReportController from '../controllers/reportController.js';

const router = express.Router();

// Rota para obter o relatório mensal de agendamentos
router.get('/schedules/report/monthly', async (req, res) => {
  try {
    const report = await ReportController.getMonthlyAppointmentReport();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter o relatório mensal de agendamentos." });
  }
});

export default router;
