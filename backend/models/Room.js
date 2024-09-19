import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;
