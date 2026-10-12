import mongoose from 'mongoose';

const weeklyScheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 1, max: 7, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

const timeOffSchema = new mongoose.Schema(
  {
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    reason: { type: String, default: 'Approved leave' },
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    weeklySchedule: {
      type: [weeklyScheduleSchema],
      default: [],
    },
    timeOff: {
      type: [timeOffSchema],
      default: [],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Availability = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
export default Availability;
