import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'
import mongoose from 'mongoose'

const CodeSnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Go', 'Rust', 'TypeScript']
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
})

const CodeSnippet = mongoose.models.CodeSnippet || mongoose.model('CodeSnippet', CodeSnippetSchema)

// GET /api/snippets - Get all code snippets for user
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
    const language = searchParams.get('language')
    const topic = searchParams.get('topic')
    const chapterId = searchParams.get('chapterId')
    const search = searchParams.get('search')

    const filter: any = { userId: user._id }
    
    if (language && language !== 'all') {
      filter.language = language
    }
    
    if (topic && topic !== 'all') {
      filter.topic = topic
    }
    
    if (chapterId && chapterId !== 'all') {
      filter.chapterId = chapterId
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const snippets = await CodeSnippet.find(filter)
      .populate('chapterId', 'title')
      .sort({ createdAt: -1 })

    return NextResponse.json(snippets)
  } catch (error) {
    console.error('Error fetching snippets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/snippets - Create new code snippet
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
      code,
      language,
      topic,
      chapterId,
      difficulty,
      tags
    } = body

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: 'Title, code, and language are required' },
        { status: 400 }
      )
    }

    const snippet = new CodeSnippet({
      title,
      description,
      code,
      language,
      topic,
      chapterId: chapterId || undefined,
      difficulty: difficulty || 'Medium',
      tags: tags || [],
      userId: user._id
    })

    await snippet.save()
    await snippet.populate('chapterId', 'title')

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error('Error creating snippet:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
