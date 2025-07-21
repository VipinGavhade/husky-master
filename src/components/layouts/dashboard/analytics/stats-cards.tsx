import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import * as motion from "motion/react-client"
import type { TaskAnalytics } from "@/app/dashboard/analytics-actions"

interface StatsCardsProps {
  analytics: TaskAnalytics
}

export function StatsCards({ analytics }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Tasks",
      value: analytics.totalTasks,
      description: "All tasks created",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: analytics.completedTasks,
      description: "Tasks finished",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: analytics.inProgressTasks,
      description: "Currently working on",
      icon: AlertCircle,
      color: "text-blue-600",
    },
    {
      title: "Completion Rate",
      value: `${analytics.completionRate}%`,
      description: "Success rate",
      icon: TrendingUp,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
