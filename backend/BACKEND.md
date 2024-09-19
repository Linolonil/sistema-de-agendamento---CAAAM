backend/
├── config/
│   └── db.js           # Configuração da conexão com o MongoDB
├── controllers/
│   ├── authController.js  # Autenticação de advogados e usuários
│   ├── userController.js  # Controle de ações relacionadas aos usuários
│   └── scheduleController.js  # Controle dos agendamentos
├── models/
│   ├── User.js           # Modelo de usuários (clientes e advogados)
│   └── Schedule.js       # Modelo de agendamentos
├── routes/
│   ├── authRoutes.js     # Rotas de autenticação (login, registro)
│   ├── userRoutes.js     # Rotas relacionadas aos usuários
│   └── scheduleRoutes.js # Rotas para agendamentos
├── middleware/
│   └── authMiddleware.js # Middleware para verificação de JWT
├── utils/
│   └── sendEmail.js      # Utilitário para envio de emails
├── server.js             # Ponto de entrada do backend
└── .env                  # Variáveis de ambiente
