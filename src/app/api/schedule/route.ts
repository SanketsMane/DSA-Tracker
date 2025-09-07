import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import { Schedule } from '@/models/Schedule'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const month = searchParams.get('month')

    await dbConnect()

    let filter: any = { userId: session.user.id }
    
    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(targetDate.getDate() + 1)
      filter.date = { $gte: targetDate, $lt: nextDay }
    } else if (month) {
      const targetMonth = new Date(month)
      const nextMonth = new Date(targetMonth)
      nextMonth.setMonth(targetMonth.getMonth() + 1)
      filter.date = { $gte: targetMonth, $lt: nextMonth }
    }

    const schedules = await Schedule.find(filter).sort({ date: 1 })
    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Get schedules error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, tasks, notes } = await request.json()

    if (!date || !tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: 'Date and tasks are required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const schedule = await Schedule.create({
      userId: session.user.id,
      date: new Date(date),
      tasks,
      notes: notes || '',
      completed: false
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Create schedule error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
