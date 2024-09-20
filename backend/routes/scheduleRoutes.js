import express from 'express';
import scheduleController from '../controllers/scheduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar um novo agendamento
router.post('/',authMiddleware, scheduleController.createSchedule);

// Listar todos os agendamentos
router.get('/',authMiddleware, scheduleController.getAllSchedules);

// Buscar um agendamento pelo ID
router.get('/:id', scheduleController.getScheduleById);

// Buscar agendamentos de um dia
router.get('/schedules/day', scheduleController.getSchedulesByDay);

// Confirmar um agendamento
router.patch('/:id/confirm', scheduleController.confirmSchedule);

// deletar todos os agendamentos 
router.delete('/deleteAll', scheduleController.deleteAllSchedules);

// deletar todos os agendamentos 
router.delete('/delete/:id', scheduleController.deleteSchedules);

export default router;
