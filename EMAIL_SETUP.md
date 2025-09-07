# DSA Tracker - Email Reminder System Setup

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Generate an app password in Gmail settings
EMAIL_FROM=DSA Tracker <your-email@gmail.com>

# Cron Job Security
CRON_SECRET=your-secure-random-string

# MongoDB and NextAuth (already configured)
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_URL=http://localhost:3000
```

## Email Service Configuration

### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as EMAIL_PASS

### Other Email Services:
You can modify `/src/lib/email.ts` to use other services like:
- SendGrid
- Mailgun
- Amazon SES
- Outlook/Hotmail

## Cron Job Setup

### Option 1: Vercel Cron Jobs (Recommended for production)

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/email-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/email-reminders",
      "schedule": "0 10 * * 0"
    }
  ]
}
```

### Option 2: External Cron Services

Use services like:
- **cron-job.org**
- **EasyCron**
- **Zapier**

Configure them to make POST/PUT requests to:
- Daily reminders: `POST https://your-domain.com/api/email-reminders`
- Weekly reports: `PUT https://your-domain.com/api/email-reminders`

Include the Authorization header: `Bearer YOUR_CRON_SECRET`

### Option 3: Server Cron (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add these lines:
# Daily reminders at 9 AM
0 9 * * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/email-reminders

# Weekly reports on Sunday at 10 AM  
0 10 * * 0 curl -X PUT -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/email-reminders
```

## Testing Email Functionality

1. **Configure email settings** in the Dashboard → Settings → Notifications
2. **Enable email notifications** and specific reminder types
3. **Test emails** using the "Test Daily Reminder" and "Test Weekly Report" buttons
4. **Check your inbox** for test emails

## Email Templates

The system includes three types of emails:

1. **Daily Learning Reminder**
   - Motivational message
   - Daily goals reminder
   - Direct link to dashboard

2. **Weekly Progress Report**
   - Problems solved count
   - Total study time
   - Current streak
   - Completed chapters

3. **Achievement Notifications**
   - Achievement unlock alerts
   - Visual celebration
   - Link to achievements page

## Troubleshooting

### Email not sending:
1. Check EMAIL_USER and EMAIL_PASS are correct
2. Verify app password for Gmail
3. Check spam folder
4. Review server logs for errors

### Cron jobs not running:
1. Verify CRON_SECRET matches
2. Check service is making requests with correct headers
3. Review API logs for authentication errors

### Database issues:
1. Ensure UserPreferences model is created
2. Check MongoDB connection
3. Verify user authentication

## Security Notes

- Never commit EMAIL_PASS to version control
- Use strong, unique CRON_SECRET
- Regularly rotate email credentials
- Monitor email sending for abuse
- Implement rate limiting if needed

## Future Enhancements

- [ ] Email template customization
- [ ] Multiple reminder time slots
- [ ] Email analytics/tracking
- [ ] Unsubscribe functionality
- [ ] GDPR compliance features
- [ ] A/B testing for email content
