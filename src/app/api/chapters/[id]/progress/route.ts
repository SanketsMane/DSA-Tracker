import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import { User } from '@/models/User'
import UserPreferences from '@/models/UserPreferences'

// PUT /api/chapters/[id]/progress - Update chapter progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { topicIndex, isCompleted, completedProblems } = body

    const chapter = await Chapter.findOne({ _id: params.id, userId: user._id })
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    // Update specific topic progress
    if (topicIndex !== undefined && chapter.topics[topicIndex]) {
      if (isCompleted !== undefined) {
        chapter.topics[topicIndex].isCompleted = isCompleted
      }
      if (completedProblems !== undefined) {
        chapter.topics[topicIndex].completedProblems = completedProblems
      }
    }

    // Mark chapter as started if not already
    if (!chapter.startedAt) {
      chapter.startedAt = new Date()
    }

    await chapter.save()

    // Update user preferences with last progress update
    await UserPreferences.findOneAndUpdate(
      { userId: user._id },
      { 
        lastProgressUpdate: new Date(),
        $inc: { totalProblems: completedProblems || 0 }
      },
      { upsert: true }
    )

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error updating chapter progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
