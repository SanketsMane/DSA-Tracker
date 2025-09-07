import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks'

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
          Welcome back! Here&apos;s your DSA learning progress overview.
        </p>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <ProgressChart />
        <RecentActivity />
      </div>
      
      <UpcomingTasks />
    </div>
  )
}
