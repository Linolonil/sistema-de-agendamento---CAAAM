import express from 'express';
import multer from 'multer';


const router = express.Router();




// Rota para upload de imagem
router.put('/api/v1/image/update-profile-image/:id', updateProfileImage);

export default router;
