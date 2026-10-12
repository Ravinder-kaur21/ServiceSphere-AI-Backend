import mongoose from 'mongoose';

const technicianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    maxDailyJobs: {
      type: Number,
      default: 5,
    },
    employmentStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'],
      default: 'ACTIVE',
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'ON_LEAVE', 'UNAVAILABLE', 'INACTIVE'],
      default: 'AVAILABLE',
    },
  },
  {
    timestamps: true,
  },
);

const TechnicianProfile =
  mongoose.models.TechnicianProfile || mongoose.model('TechnicianProfile', technicianProfileSchema);

export default TechnicianProfile;
