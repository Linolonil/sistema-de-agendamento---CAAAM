import express from 'express';
import userController from '../controllers/userController.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}&&${file.originalname}`);
    }
  });
  
const upload = multer({storage:storage})
  

// Criar um novo usuário
router.post('/', upload.single('iconProfile'),userController.createUser);

// Listar todos os usuários
router.get('/', userController.getAllUsers);

// Buscar um usuário pelo ID
router.get('/:id', userController.getUserById);

// Atualizar um usuário
router.put('/:id', upload.single('iconProfile'), userController.updateUser);

// Excluir um usuário
router.delete('/:id', userController.deleteUser);

export default router;
