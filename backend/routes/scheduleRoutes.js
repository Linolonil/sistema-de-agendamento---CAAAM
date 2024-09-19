import express from 'express';
import scheduleController from '../controllers/scheduleController.js';

const router = express.Router();

// Criar um novo agendamento
router.post('/', scheduleController.createSchedule);

// Listar todos os agendamentos
router.get('/', scheduleController.getAllSchedules);

// Buscar um agendamento pelo ID
router.get('/:id', scheduleController.getScheduleById);

// Confirmar um agendamento
router.patch('/:id/confirm', scheduleController.confirmSchedule);

export default router;
