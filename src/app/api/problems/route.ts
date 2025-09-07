import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import { Problem } from '@/models/Problem'
import { User } from '@/models/User'
import UserPreferences from '@/models/UserPreferences'
import { authOptions } from '@/lib/auth'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const chapterId = searchParams.get('chapterId')
    const difficulty = searchParams.get('difficulty')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const filter: any = { userId: user._id }
    
    if (chapterId && chapterId !== 'all') {
      filter.chapterId = chapterId
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty
    }
    
    if (status && status !== 'all') {
      filter.status = status
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const problems = await Problem.find(filter)
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Problem.countDocuments(filter)

    return NextResponse.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
      difficulty,
      topics,
      chapterId,
      notes,
      url,
      status = 'Not Started'
    } = body

    if (!title || !difficulty) {
      return NextResponse.json(
        { error: 'Title and difficulty are required' },
        { status: 400 }
      )
    }

    const problem = new Problem({
      title,
      difficulty,
      topics: topics || [],
      chapterId: chapterId || undefined,
      notes: notes || '',
      url,
      status,
      userId: user._id,
      codeSnippets: [],
      attachments: []
    })

    await problem.save()
    await problem.populate('chapterId', 'title')

    // Update user preferences
    await UserPreferences.findOneAndUpdate(
      { userId: user._id },
      { 
        lastProgressUpdate: new Date(),
        $inc: { totalProblems: 1 }
      },
      { upsert: true }
    )

    return NextResponse.json(problem, { status: 201 })
  } catch (error) {
    console.error('Error creating problem:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
