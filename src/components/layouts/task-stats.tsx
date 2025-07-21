"use client"

import motion from "motion/react-client"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/lib/supabase"

interface TaskStatsProps {
  tasks: Task[]
}

const COLORS = {
  pending: "#f59e0b",
  completed: "#10b981",
  cancelled: "#ef4444",
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = tasks.reduce(
(acc, task) => {
    // To be safe, increment only if key exists; else initialize
    if (acc[task.status] === undefined) {
      acc[task.status] = 1
    } else {
      acc[task.status]++
    }
    return acc
  },
      { pending: 0, completed: 0, cancelled: 0, in_progress: 0 },
  )

  const total = tasks.length
  const chartData = [
    { name: "Pending", value: stats.pending, percentage: total ? Math.round((stats.pending / total) * 100) : 0 },
    { name: "Completed", value: stats.completed, percentage: total ? Math.round((stats.completed / total) * 100) : 0 },
    { name: "Cancelled", value: stats.cancelled, percentage: total ? Math.round((stats.cancelled / total) * 100) : 0 },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} tasks ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Distribution of your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Quick overview of your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="font-medium text-amber-800">Pending</span>
              <span className="text-2xl font-bold text-amber-600">{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-800">Completed</span>
              <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-800">Cancelled</span>
              <span className="text-2xl font-bold text-red-600">{stats.cancelled}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <span className="font-medium text-blue-800">Total Tasks</span>
              <span className="text-2xl font-bold text-blue-600">{total}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
