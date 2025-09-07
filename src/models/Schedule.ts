import mongoose from 'mongoose'

export interface ISchedule {
  _id?: string
  userId: mongoose.Types.ObjectId
  date: Date
  tasks: string[]
  completed: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const scheduleSchema = new mongoose.Schema<ISchedule>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tasks: [{
    type: String,
    required: true,
    trim: true
  }],
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
})

scheduleSchema.index({ userId: 1, date: 1 }, { unique: true })

export const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', scheduleSchema)

export interface IBadge {
  _id?: string
  userId: mongoose.Types.ObjectId
  badgeType: string
  title: string
  description: string
  icon: string
  dateEarned: Date
}

const badgeSchema = new mongoose.Schema<IBadge>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeType: {
    type: String,
    required: true,
    enum: [
      'first_problem', 'easy_master', 'medium_master', 'hard_master',
      'streak_7', 'streak_30', 'streak_100', 'problem_solver_50',
      'problem_solver_100', 'problem_solver_500', 'topic_master_arrays',
      'topic_master_strings', 'topic_master_trees', 'speed_demon'
    ]
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  dateEarned: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
})

badgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true })

export const Badge = mongoose.models.Badge || mongoose.model<IBadge>('Badge', badgeSchema)
