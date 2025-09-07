import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'

// Study Session Schema
const studySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  duration: { type: Number, required: true }, // in minutes
  topics: [{ type: String }],
  notes: { type: String },
  problemsSolved: { type: Number, default: 0 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Mixed'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema)

// GET /api/study-sessions - Get user's study sessions
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
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query
    const query: any = { userId: user._id }
    
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = startDate
      if (endDate) query.date.$lte = endDate
    }

    const studySessions = await StudySession.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)

    return NextResponse.json(studySessions)
  } catch (error) {
    console.error('Error fetching study sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/study-sessions - Create a new study session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, duration, topics, notes, problemsSolved, difficulty } = body

    if (!date || !duration) {
      return NextResponse.json({ error: 'Date and duration are required' }, { status: 400 })
    }

    await dbConnect()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if study session already exists for this date
    const existingSession = await StudySession.findOne({
      userId: user._id,
      date: date
    })

    let studySession

    if (existingSession) {
      // Update existing session by adding to it
      studySession = await StudySession.findByIdAndUpdate(
        existingSession._id,
        {
          duration: existingSession.duration + parseInt(duration),
          topics: [...new Set([...existingSession.topics, ...topics])], // merge unique topics
          notes: existingSession.notes ? `${existingSession.notes}\n\n---\n\n${notes || ''}` : notes,
          problemsSolved: existingSession.problemsSolved + (parseInt(problemsSolved) || 0),
          difficulty: difficulty || existingSession.difficulty,
          updatedAt: new Date()
        },
        { new: true }
      )
    } else {
      // Create new session
      studySession = new StudySession({
        userId: user._id,
        date,
        duration: parseInt(duration),
        topics: topics || [],
        notes: notes || '',
        problemsSolved: parseInt(problemsSolved) || 0,
        difficulty: difficulty || 'Medium'
      })

      await studySession.save()
    }

    return NextResponse.json(studySession, { status: 201 })
  } catch (error) {
    console.error('Error creating study session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/study-sessions - Update study session
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, date, duration, topics, notes, problemsSolved, difficulty } = body

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

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

// DELETE /api/study-sessions/[id] - Delete study session
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

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
