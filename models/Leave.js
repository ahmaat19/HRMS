import mongoose from 'mongoose'
import User from './User'
import Employee from './Employee'

const leaveScheme = mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee,
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, required: true },
    reason: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveScheme)
export default Leave
