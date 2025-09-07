import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'

// Study Session Schema (same as in route.ts)
const studySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  duration: { type: Number, required: true },
  topics: [{ type: String }],
  notes: { type: String },
  problemsSolved: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Mixed'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)

// DELETE /api/study-sessions/[id] - Delete specific study session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const studySession = await StudySession.findOneAndDelete({
      _id: id,
      userId: user._id
    })

    if (!studySession) {
      return NextResponse.json({ error: 'Study session not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Study session deleted successfully' })
  } catch (error) {
    console.error('Error deleting study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/study-sessions/[id] - Get specific study session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const studySession = await StudySession.findOne({
      _id: id,
      userId: user._id
    })

    if (!studySession) {
      return NextResponse.json({ error: 'Study session not found' }, { status: 404 })
    }

    return NextResponse.json(studySession)
  } catch (error) {
    console.error('Error fetching study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/study-sessions/[id] - Update specific study session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { date, duration, topics, notes, problemsSolved, difficulty } = body

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const studySession = await StudySession.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        date,
        duration: parseInt(duration),
        topics: topics || [],
        notes: notes || '',
        problemsSolved: parseInt(problemsSolved) || 0,
        difficulty: difficulty || 'Medium',
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!studySession) {
      return NextResponse.json({ error: 'Study session not found' }, { status: 404 })
    }

    return NextResponse.json(studySession)
  } catch (error) {
    console.error('Error updating study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
