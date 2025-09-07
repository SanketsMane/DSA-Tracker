import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import { User } from '@/models/User'

// GET /api/chapters - Get all chapters for user
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

    const chapters = await Chapter.find({ userId: user._id })
      .populate('prerequisites', 'title')
      .sort({ order: 1, createdAt: 1 })

    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/chapters - Create new chapter
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
      topics = [],
      estimatedDays = 7,
      prerequisites = [],
      resources = [],
      order
    } = body

    // If no order specified, set as last
    let chapterOrder = order
    if (chapterOrder === undefined) {
      const lastChapter = await Chapter.findOne({ userId: user._id }).sort({ order: -1 })
      chapterOrder = lastChapter ? lastChapter.order + 1 : 1
    }

    const chapter = new Chapter({
      title,
      description,
      topics,
      estimatedDays,
      prerequisites,
      resources,
      order: chapterOrder,
      userId: user._id,
    })

    await chapter.save()
    await chapter.populate('prerequisites', 'title')

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
