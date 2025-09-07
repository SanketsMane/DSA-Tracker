import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  target: {
    type: Number,
    required: true,
    min: 1,
  },
  current: {
    type: Number,
    default: 0,
    min: 0,
  },
  unit: {
    type: String,
    default: 'problems',
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
})

// Auto-complete goal when target is reached
GoalSchema.pre('save', function(next) {
  if (this.current >= this.target && this.status !== 'completed') {
    this.status = 'completed'
  }
  next()
})

const Goal = mongoose.models.Goal || mongoose.model('Goal', GoalSchema)

// GET /api/goals - Get all goals for user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const chapterId = searchParams.get('chapterId')

    const filter: any = { userId: user._id }
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (type && type !== 'all') {
      filter.type = type
    }
    
    if (chapterId && chapterId !== 'all') {
      filter.chapterId = chapterId
    }

    const goals = await Goal.find(filter)
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/goals - Create new goal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      target,
      unit,
      deadline,
      priority,
      chapterId
    } = body

    if (!title || !type || !target || !deadline) {
      return NextResponse.json(
        { error: 'Title, type, target, and deadline are required' },
        { status: 400 }
      )
    }

    const goal = new Goal({
      title,
      description,
      type,
      target,
      unit: unit || 'problems',
      deadline: new Date(deadline),
      priority: priority || 'medium',
      chapterId: chapterId || undefined,
      userId: user._id,
      current: 0,
      status: 'active'
    })

    await goal.save()
    await goal.populate('chapterId', 'title')

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
