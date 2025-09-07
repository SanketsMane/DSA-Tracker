import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    console.log('Signup request started')
    const { name, email, password } = await request.json()
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

    console.log('Connecting to database...')
    await dbConnect()
    console.log('Database connected')

    // Check if user already exists
    console.log('Checking for existing user...')
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log('Creating user...')
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
    console.log('User created successfully')

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
