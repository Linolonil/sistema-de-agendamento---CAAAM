import mongoose from 'mongoose';

const { Schema } = mongoose;

const lawyerSchema = new Schema({
  name: {
    type: String,
      required: true
    },
  role: {
    type: String,
    required: true
  },
  oab: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

export default Lawyer;
