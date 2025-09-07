import mongoose from 'mongoose'

export interface IUser {
  _id?: string
  name: string
  email: string
  passwordHash: string
  profile: {
    bio?: string
    skills: string[]
    preferences: {
      theme?: 'light' | 'dark' | 'system'
      dailyGoal?: number
      notifications?: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500
    },
    skills: [{
      type: String,
      trim: true
    }],
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      dailyGoal: {
        type: Number,
        default: 3,
        min: 1,
        max: 20
      },
      notifications: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
})

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
