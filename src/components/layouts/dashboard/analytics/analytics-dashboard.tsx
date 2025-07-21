import * as motion from "motion/react-client"
import { StatsCards } from "./stats-cards"
import { TaskStatusChart } from "./task-status-chart"
import { WeeklyProgressChart } from "./weekly-progress-chart"
import { MonthlyTrendsChart } from "./monthly-trends-chart"
import { UpcomingDeadlines } from "./upcoming-deadlines"
import type { TaskAnalytics } from "@/app/dashboard/analytics-actions"

interface AnalyticsDashboardProps {
  analytics: TaskAnalytics
}

export function AnalyticsDashboard({ analytics }: AnalyticsDashboardProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Stats Cards */}
      <StatsCards analytics={analytics} />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <TaskStatusChart data={analytics.statusDistribution} />
        <UpcomingDeadlines deadlines={analytics.upcomingDeadlines} />
      </div>

      {/* Progress Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyProgressChart data={analytics.weeklyProgress} />
        <MonthlyTrendsChart data={analytics.monthlyTrends} />
      </div>
    </motion.div>
  )
}
