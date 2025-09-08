import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup request started')
    
    // Test basic functionality first
    const body = await request.json()
    console.log('Request body parsed successfully')
    
    const { name, email, password } = body
    console.log('Received data:', { name, email, passwordLength: password?.length })

    if (!name || !email || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('Password too short')
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Test bcrypt functionality
    console.log('Testing bcrypt...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('Bcrypt hash successful')

    // Test database connection
    console.log('Connecting to database...')
    await dbConnect()
    console.log('Database connected successfully')

    // Check if user already exists
    console.log('Checking for existing user...')
    const existingUser = await User.findOne({ email })
    console.log('User search completed, exists:', !!existingUser)
    
    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    console.log('Creating user with data:', {
      name,
      email,
      hasPasswordHash: !!hashedPassword,
      profileStructure: {
        bio: '',
        skills: [],
        preferences: {
          theme: 'system',
          dailyGoal: 3,
          notifications: true
        }
      }
    })
    
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      profile: {
        bio: '',
        skills: [],
        preferences: {
          theme: 'system',
          dailyGoal: 3,
          notifications: true
        }
      }
    })
    console.log('User created successfully with ID:', user._id)

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
      },
      { status: 500 }
    )
  }
}
