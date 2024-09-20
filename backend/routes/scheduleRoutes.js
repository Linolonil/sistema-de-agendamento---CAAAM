import express from 'express';
import scheduleController from '../controllers/scheduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar um novo agendamento
router.post('/',authMiddleware, scheduleController.createSchedule);

// Listar todos os agendamentos
router.get('/',authMiddleware, scheduleController.getAllSchedules);

// Buscar um agendamento pelo ID
router.get('/:id',authMiddleware, scheduleController.getScheduleById);

// Buscar agendamentos de um dia
router.get('/schedules/day',authMiddleware, scheduleController.getSchedulesByDay);

// Confirmar um agendamento
router.patch('/:id/confirm',authMiddleware, scheduleController.confirmSchedule);

// deletar todos os agendamentos 
router.delete('/deleteAll',authMiddleware, scheduleController.deleteAllSchedules);

// deletar um agendamento
router.delete('/delete/:id',authMiddleware, scheduleController.deleteSchedules);

export default router;
