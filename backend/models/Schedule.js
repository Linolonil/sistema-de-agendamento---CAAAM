import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true, // Ex: "08:00"
        validate: {
            validator: function(value) {
                // Validação para garantir que o horário esteja entre 08:00 e 17:00
                const hour = parseInt(value.split(':')[0]);
                return hour >= 8 && hour < 18;
            },
            message: 'O horário deve estar entre 08:00 e 17:00.'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    type: {
        type: String,
        enum: ['meeting', 'hearing'],
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Índices compostos para evitar agendamentos em conflitos
scheduleSchema.index({ date: 1, time: 1, roomId: 1 }, { unique: true });

// Atualiza o campo updatedAt sempre que o documento for modificado
scheduleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
