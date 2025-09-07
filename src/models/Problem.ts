import mongoose from 'mongoose'

export interface ICodeSnippet {
  language: string
  code: string
  createdAt: Date
}

export interface IProblem {
  _id?: string
  userId: mongoose.Types.ObjectId
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topics: string[]
  chapterId?: mongoose.Types.ObjectId
  status: 'Not Started' | 'In Progress' | 'Completed'
  notes?: string
  codeSnippets: ICodeSnippet[]
  attachments: string[] // URLs to uploaded files
  url?: string // Link to the problem (e.g., LeetCode, HackerRank)
  timeSpent?: number // Minutes spent on the problem
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const codeSnippetSchema = new mongoose.Schema<ICodeSnippet>({
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'typescript', 'kotlin', 'swift']
  },
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const problemSchema = new mongoose.Schema<IProblem>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  topics: [{
    type: String,
    required: true
  }],
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  status: {
    type: String,
    required: true,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  codeSnippets: [codeSnippetSchema],
  attachments: [{
    type: String
  }],
  url: {
    type: String,
    trim: true
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
})

problemSchema.index({ userId: 1, createdAt: -1 })
problemSchema.index({ userId: 1, status: 1 })
problemSchema.index({ userId: 1, difficulty: 1 })
problemSchema.index({ userId: 1, topics: 1 })

export const Problem = mongoose.models.Problem || mongoose.model<IProblem>('Problem', problemSchema)
