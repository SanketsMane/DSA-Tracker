import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import { User } from '@/models/User'

// GET /api/chapters/[id] - Get specific chapter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const resolvedParams = await params
    const chapter = await Chapter.findOne({ _id: resolvedParams.id, userId: user._id })
      .populate('prerequisites', 'title')

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/chapters/[id] - Update chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const resolvedParams = await params
    
    const chapter = await Chapter.findOneAndUpdate(
      { _id: resolvedParams.id, userId: user._id },
      body,
      { new: true, runValidators: true }
    ).populate('prerequisites', 'title')

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/chapters/[id] - Delete chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const resolvedParams = await params
    const chapter = await Chapter.findOneAndDelete({ _id: resolvedParams.id, userId: user._id })

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Chapter deleted successfully' })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
