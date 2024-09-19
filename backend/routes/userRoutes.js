import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Criar um novo usuário
router.post('/', userController.createUser);

// Listar todos os usuários
router.get('/', userController.getAllUsers);

// Buscar um usuário pelo ID
router.get('/:id', userController.getUserById);

// Atualizar um usuário
router.put('/:id', userController.updateUser);

// Excluir um usuário
router.delete('/:id', userController.deleteUser);

export default router;
