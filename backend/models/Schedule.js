import mongoose from 'mongoose';

const { Schema } = mongoose;

const scheduleSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  lawyerId: {
    type: Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  type: {
    type: String,
    enum: ['meeting', 'hearing'],
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
