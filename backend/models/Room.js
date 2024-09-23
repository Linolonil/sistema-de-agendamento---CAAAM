import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  hasAirConditioning: {
    type: Boolean,
    default: false,  // Indica se a sala tem ar-condicionado
  },
  hasTV: {
    type: Boolean,
    default: false,  // Indica se a sala tem TV
  },
  capacity: {
    type: Number,
    required: true,  // Quantas pessoas a sala suporta
    min: 1          // Valor mínimo de capacidade, por exemplo, 1
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;
