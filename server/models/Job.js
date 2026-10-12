import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'ASSIGNED',
    },
    scheduledStart: {
      type: Date,
      required: true,
    },
    scheduledEnd: {
      type: Date,
      required: true,
    },
    estimatedDurationMinutes: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
