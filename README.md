# 🚀 DSA Tracker

A comprehensive Data Structures & Algorithms tracking application built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

![DSA Tracker](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 **Core Functionality**
- **Problem Tracking**: Track 1000+ DSA problems with difficulty levels and status management
- **Study Sessions**: Log daily study time, topics covered, and maintain learning streaks
- **Chapter Management**: Organize problems by topics and chapters
- **Code Snippets**: Store and manage solution snippets with syntax highlighting
- **Analytics Dashboard**: Visualize progress with charts and performance metrics

### 🎯 **Advanced Features**
- **Email Reminders**: Automated daily and weekly progress notifications
- **Goal Setting**: Set and track personal learning objectives
- **Gamification**: Earn badges, maintain streaks, and unlock achievements
- **Mobile Responsive**: Fully optimized for all devices
- **Dark Mode**: Complete dark/light theme support
- **Real-time Sync**: Instant updates across all features

### 🔐 **Authentication & Security**
- NextAuth.js integration with JWT
- Secure user authentication and session management
- Protected API routes and data privacy

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB Atlas
- **Authentication**: NextAuth.js
- **Email Service**: Nodemailer with Gmail SMTP
- **Charts**: Chart.js & React Chart.js 2
- **UI Components**: Radix UI, Headless UI
- **Deployment**: Vercel

## � Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Gmail account (for email features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanketsMane/DSA-Tracker.git
   cd DSA-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_jwt_key

   # Email Service
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FROM_EMAIL=your_email@gmail.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📱 Key Pages

- **Dashboard** (`/dashboard`) - Overview of progress and statistics
- **Problems** (`/dashboard/problems`) - Problem tracking and management
- **Study Tracking** (`/dashboard/study-tracking`) - Daily study session logging
- **Chapters** (`/dashboard/chapters`) - Topic-wise organization
- **Analytics** (`/dashboard/analytics`) - Progress visualization
- **Settings** (`/dashboard/settings`) - Profile and notification preferences

## 🌐 API Endpoints

### Problems
- `GET /api/problems` - Get user problems with filtering
- `POST /api/problems` - Create new problem
- `PUT /api/problems/[id]` - Update problem
- `DELETE /api/problems/[id]` - Delete problem

### Study Sessions
- `GET /api/study-sessions` - Get study sessions
- `POST /api/study-sessions` - Create study session
- `GET /api/study-sessions/stats` - Get study statistics

### Email Reminders
- `GET /api/email-reminders` - Test email functionality
- `POST /api/email-reminders` - Send daily reminders (cron)

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add all environment variables from `.env.local`

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  profile: {
    bio: String,
    skills: [String],
    preferences: {
      theme: String,
      dailyGoal: Number,
      notifications: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Problems Collection
```javascript
{
  userId: ObjectId,
  title: String,
  difficulty: String, // Easy, Medium, Hard
  topics: [String],
  status: String, // Not Started, In Progress, Completed
  notes: String,
  codeSnippets: [{
    language: String,
    code: String,
    createdAt: Date
  }],
  attachments: [String],
  url: String,
  timeSpent: Number,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Schedules Collection
```javascript
{
  userId: ObjectId,
  date: Date,
  tasks: [String],
  completed: Boolean,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Badges Collection
```javascript
{
  userId: ObjectId,
  badgeType: String,
  title: String,
  description: String,
  icon: String,
  dateEarned: Date
}
```

## 🔧 API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)

### Problems
- `GET /api/problems` - Get user's problems (with filtering)
- `POST /api/problems` - Create new problem
- `GET /api/problems/[id]` - Get specific problem
- `PUT /api/problems/[id]` - Update problem
- `DELETE /api/problems/[id]` - Delete problem

### Schedule
- `GET /api/schedule` - Get user's schedule
- `POST /api/schedule` - Create schedule entry
- `PUT /api/schedule/[id]` - Update schedule entry

### Analytics
- `GET /api/analytics/overview` - Get dashboard statistics
- `GET /api/analytics/progress` - Get progress charts data

## 🎨 UI Components

The application uses a design system with reusable components:

- **Button**: Primary, secondary, outline, ghost variants
- **Card**: Content containers with header, body, footer
- **Input**: Form inputs with validation states
- **Label**: Form labels with proper accessibility
- **Theme Provider**: Dark/light mode management

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dsa-tracker
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📚 Features Roadmap

### Phase 1 (Current)
- [x] User authentication
- [x] Problem tracking
- [x] Basic dashboard
- [x] Code snippets

### Phase 2
- [ ] Analytics dashboard
- [ ] Study scheduling
- [ ] File uploads
- [ ] Search and filtering

### Phase 3
- [ ] Gamification system
- [ ] Social sharing
- [ ] Notifications
- [ ] Data export

### Phase 4
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] AI-powered recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �‍💻 Developer

**Sanket Mane**
- 🌐 **GitHub**: [@SanketsMane](https://github.com/SanketsMane)
- 📧 **Email**: contactsanket1@gmail.com
- 📱 **Instagram**: [@sanketpatil_1010](https://www.instagram.com/sanketpatil_1010/)
- 🎥 **YouTube**: [@CodeWithSanket30](https://www.youtube.com/@CodeWithSanket30)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Vercel](https://vercel.com/) for seamless deployment

---

⭐ **Star this repository if you found it helpful!**
