import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configure Gmail SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  async sendEmail({ to, subject, html }: EmailOptions) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
        to,
        subject,
        html,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  // Daily login reminder
  async sendDailyReminder(userEmail: string, userName: string) {
    const subject = '🎯 Don\'t break your streak! Daily DSA reminder'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Hello ${userName}! 👋</h1>
        
        <p>This is your daily reminder to continue your DSA learning journey!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📚 Today's Goals:</h3>
          <ul style="color: #6b7280;">
            <li>Solve at least 1 problem</li>
            <li>Review a concept from your chapters</li>
            <li>Practice coding for 30 minutes</li>
          </ul>
        </div>
        
        <p style="color: #6b7280;">
          Remember: Consistency is key to mastering Data Structures and Algorithms!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Continue Learning 🚀
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 14px; text-align: center;">
          You're receiving this email because you enabled daily reminders in your DSA Tracker settings.
          <br>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/settings" style="color: #3b82f6;">
            Update your notification preferences
          </a>
        </p>
      </div>
    `
    
    return this.sendEmail({ to: userEmail, subject, html })
  }

  // Weekly progress report
  async sendWeeklyProgressReport(
    userEmail: string,
    userName: string,
    stats: {
      problemsSolved: number
      totalTime: number
      streakDays: number
      completedChapters: number
    }
  ) {
    const subject = '📊 Your Weekly DSA Progress Report'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Week in Review 📈</h1>
        
        <p>Hi ${userName}! Here's your weekly DSA progress summary:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="text-align: center;">
              <h3 style="color: #059669; margin: 0; font-size: 2em;">${stats.problemsSolved}</h3>
              <p style="color: #6b7280; margin: 5px 0;">Problems Solved</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #dc2626; margin: 0; font-size: 2em;">${Math.floor(stats.totalTime / 60)}h ${stats.totalTime % 60}m</h3>
              <p style="color: #6b7280; margin: 5px 0;">Study Time</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #7c3aed; margin: 0; font-size: 2em;">${stats.streakDays}</h3>
              <p style="color: #6b7280; margin: 5px 0;">Day Streak</p>
            </div>
            <div style="text-align: center;">
              <h3 style="color: #ea580c; margin: 0; font-size: 2em;">${stats.completedChapters}</h3>
              <p style="color: #6b7280; margin: 5px 0;">Chapters Done</p>
            </div>
          </div>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #047857;">
            <strong>Great job this week!</strong> Keep up the momentum and continue building your skills.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            View Detailed Progress 📊
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 14px; text-align: center;">
          DSA Tracker - Your personal learning companion
        </p>
      </div>
    `
    
    return this.sendEmail({ to: userEmail, subject, html })
  }

  // Achievement notification
  async sendAchievementNotification(
    userEmail: string,
    userName: string,
    achievement: {
      title: string
      description: string
      icon: string
    }
  ) {
    const subject = `🏆 Achievement Unlocked: ${achievement.title}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
          <div style="font-size: 4em; margin-bottom: 20px;">${achievement.icon}</div>
          <h1 style="margin: 0 0 10px 0;">Achievement Unlocked!</h1>
          <h2 style="margin: 0; font-weight: normal;">${achievement.title}</h2>
        </div>
        
        <div style="padding: 30px 20px; text-align: center;">
          <p style="font-size: 18px; color: #374151;">
            Congratulations ${userName}! 🎉
          </p>
          
          <p style="color: #6b7280; font-size: 16px; margin: 20px 0;">
            ${achievement.description}
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #374151; margin: 0;">
              <strong>Keep going!</strong> Every achievement brings you closer to mastering DSA.
            </p>
          </div>
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard/achievements" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            View All Achievements 🏆
          </a>
        </div>
      </div>
    `
    
    return this.sendEmail({ to: userEmail, subject, html })
  }
}

export const emailService = new EmailService()
