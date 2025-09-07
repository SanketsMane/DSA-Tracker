import mongoose from 'mongoose'

const UserPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  emailReminders: {
    enabled: {
      type: Boolean,
      default: true,
    },
    dailyLoginTime: {
      type: String,
      default: '09:00', // HH:MM format
    },
    progressReportTime: {
      type: String,
      default: '18:00', // HH:MM format
    },
    weeklyReportDay: {
      type: Number,
      default: 0, // 0 = Sunday, 1 = Monday, etc.
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
  },
  lastLoginDate: {
    type: Date,
    default: Date.now,
  },
  lastProgressUpdate: {
    type: Date,
    default: Date.now,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  totalProblems: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

export default mongoose.models.UserPreferences || mongoose.model('UserPreferences', UserPreferencesSchema)
