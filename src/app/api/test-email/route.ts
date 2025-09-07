import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'daily'
    
    // Test email with your actual email
    const testEmail = 'visiontrading001@gmail.com'
    const testName = 'Test User'
    
    let result
    
    if (type === 'daily') {
      result = await emailService.sendDailyReminder(testEmail, testName)
    } else if (type === 'weekly') {
      result = await emailService.sendWeeklyProgressReport(testEmail, testName, {
        problemsSolved: 15,
        totalTime: 120, // 2 hours
        streakDays: 7,
        completedChapters: 3
      })
    } else if (type === 'achievement') {
      result = await emailService.sendAchievementNotification(testEmail, testName, {
        title: 'First Week Complete!',
        description: 'You have successfully completed your first week of consistent studying.',
        icon: '🎉'
      })
    } else {
      return NextResponse.json({ error: 'Invalid type. Use daily, weekly, or achievement' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: result.success,
      message: result.success 
        ? `Test ${type} email sent successfully!` 
        : `Failed to send ${type} email: ${result.error}`,
      result
    })
  } catch (error) {
    console.error('Error testing email:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: (error as Error).message
    }, { status: 500 })
  }
}
