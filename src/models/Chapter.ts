import mongoose from 'mongoose'

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  topics: [{
    name: {
      type: String,
      required: true,
    },
    totalProblems: {
      type: Number,
      default: 0,
    },
    completedProblems: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  }],
  order: {
    type: Number,
    default: 0,
  },
  estimatedDays: {
    type: Number,
    default: 7,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'book', 'course'],
      default: 'article',
    },
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
})

// Calculate progress based on completed topics
ChapterSchema.pre('save', function(next) {
  if (this.topics && this.topics.length > 0) {
    const completedTopics = this.topics.filter(topic => topic.isCompleted).length
    this.progress = Math.round((completedTopics / this.topics.length) * 100)
    this.isCompleted = this.progress === 100
    
    if (this.isCompleted && !this.completedAt) {
      this.completedAt = new Date()
    }
  }
  next()
})

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema)
