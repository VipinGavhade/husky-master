import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import * as motion from "motion/react-client"

interface UpcomingDeadlinesProps {
  deadlines: Array<{
    id: string
    title: string
    due_date: string
    status: string
    daysUntilDue: number
  }>
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const getUrgencyColor = (days: number) => {
    if (days <= 1) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    if (days <= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>Tasks due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {deadlines.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
          ) : (
            <div className="space-y-3">
              {deadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium truncate">{deadline.title}</h4>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(deadline.due_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getUrgencyColor(deadline.daysUntilDue)}>
                      {deadline.daysUntilDue === 0
                        ? "Today"
                        : deadline.daysUntilDue === 1
                          ? "Tomorrow"
                          : `${deadline.daysUntilDue} days`}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(deadline.status)}>
                      {deadline.status.replace("_", " ")}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
