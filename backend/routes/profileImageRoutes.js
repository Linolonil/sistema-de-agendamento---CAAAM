import express from 'express';
import User from '../models/User.js'; // Modelo do usuário
import multer from 'multer'; // Para fazer upload de arquivos

const router = express.Router();

// Configuração do multer para armazenar imagens (local ou serviço externo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter: fileFilter,
});

// Rota para atualizar a imagem do perfil do usuário
router.put('/update-profile-image/:id', upload.single('iconProfile'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Verifica se a imagem foi enviada no corpo da requisição
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    // Caminho da imagem salva (ajuste conforme necessário se usar um serviço externo como Cloudinary)
    const imageUrl = `/uploads/${req.file.filename}`;

    // Atualizar o campo 'iconProfile' no usuário
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { iconProfile: imageUrl },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar a imagem do perfil:', error);
    return res.status(500).json({ message: 'Erro ao atualizar imagem do perfil' });
  }
});

export default router;
