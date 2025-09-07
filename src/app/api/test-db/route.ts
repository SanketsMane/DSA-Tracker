import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    // Test database connection
    await dbConnect()
    console.log('Database connected successfully')
    
    // Test user model
    const userCount = await User.countDocuments()
    console.log('User count:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
