import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTaskDialog } from "@/components/layouts/dashboard/create-task-dialog"
import { TaskList } from "@/components/layouts/dashboard/task-list"
import { AnalyticsDashboard } from "@/components/layouts/dashboard/analytics/analytics-dashboard"
import { getTasks } from "./action"
import { getTaskAnalytics } from "./analytics-actions"
import { LogoutButton } from "@/components/logout-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, List } from "lucide-react"

export default async function DashboardPage() {
  const [tasks, analytics] = await Promise.all([getTasks(), getTaskAnalytics()])

  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Top Of Dashboard */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard analytics={analytics} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            {/* Manage tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Manage tasks
                  <CreateTaskDialog />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskList initialTasks={tasks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
