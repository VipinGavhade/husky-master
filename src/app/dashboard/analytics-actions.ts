"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface TaskAnalytics {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  cancelledTasks: number
  completionRate: number
  statusDistribution: Array<{
    status: string
    count: number
    percentage: number
  }>
  weeklyProgress: Array<{
    date: string
    completed: number
    created: number
  }>
  monthlyTrends: Array<{
    month: string
    completed: number
    created: number
  }>
  upcomingDeadlines: Array<{
    id: string
    title: string
    due_date: string
    status: string
    daysUntilDue: number
  }>
}

export async function getTaskAnalytics(): Promise<TaskAnalytics> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch all tasks for the user
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks:", error)
    return getEmptyAnalytics()
  }

  if (!tasks || tasks.length === 0) {
    return getEmptyAnalytics()
  }

  // Calculate basic statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
  const cancelledTasks = tasks.filter((task) => task.status === "cancelled").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Status distribution
  const statusDistribution = [
    {
      status: "Completed",
      count: completedTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
    {
      status: "In Progress",
      count: inProgressTasks,
      percentage: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0,
    },
    {
      status: "Pending",
      count: pendingTasks,
      percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0,
    },
    {
      status: "Cancelled",
      count: cancelledTasks,
      percentage: totalTasks > 0 ? Math.round((cancelledTasks / totalTasks) * 100) : 0,
    },
  ].filter((item) => item.count > 0)

  // Weekly progress (last 7 days)
  const weeklyProgress = getWeeklyProgress(tasks)

  // Monthly trends (last 6 months)
  const monthlyTrends = getMonthlyTrends(tasks)

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = getUpcomingDeadlines(tasks)

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    cancelledTasks,
    completionRate,
    statusDistribution,
    weeklyProgress,
    monthlyTrends,
    upcomingDeadlines,
  }
}

function getEmptyAnalytics(): TaskAnalytics {
  return {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    cancelledTasks: 0,
    completionRate: 0,
    statusDistribution: [],
    weeklyProgress: [],
    monthlyTrends: [],
    upcomingDeadlines: [],
  }
}

function getWeeklyProgress(tasks: any[]): Array<{ date: string; completed: number; created: number }> {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  return last7Days.map((date) => {
    const dayStart = new Date(date + "T00:00:00.000Z")
    const dayEnd = new Date(date + "T23:59:59.999Z")

    const created = tasks.filter((task) => {
      const createdAt = new Date(task.created_at)
      return createdAt >= dayStart && createdAt <= dayEnd
    }).length

    const completed = tasks.filter((task) => {
      const updatedAt = new Date(task.updated_at)
      return task.status === "completed" && updatedAt >= dayStart && updatedAt <= dayEnd
    }).length

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      completed,
      created,
    }
  })
}

function getMonthlyTrends(tasks: any[]): Array<{ month: string; completed: number; created: number }> {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      name: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    }
  }).reverse()

  return last6Months.map(({ year, month, name }) => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999)

    const created = tasks.filter((task) => {
      const createdAt = new Date(task.created_at)
      return createdAt >= monthStart && createdAt <= monthEnd
    }).length

    const completed = tasks.filter((task) => {
      const updatedAt = new Date(task.updated_at)
      return task.status === "completed" && updatedAt >= monthStart && updatedAt <= monthEnd
    }).length

    return { month: name, completed, created }
  })
}

function getUpcomingDeadlines(tasks: any[]): Array<{
  id: string
  title: string
  due_date: string
  status: string
  daysUntilDue: number
}> {
  const now = new Date()
  const next7Days = new Date()
  next7Days.setDate(now.getDate() + 7)

  return tasks
    .filter((task) => {
      if (!task.due_date || task.status === "completed" || task.status === "cancelled") return false
      const dueDate = new Date(task.due_date)
      return dueDate >= now && dueDate <= next7Days
    })
    .map((task) => {
      const dueDate = new Date(task.due_date)
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        id: task.id,
        title: task.title,
        due_date: task.due_date,
        status: task.status,
        daysUntilDue,
      }
    })
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, 5)
}
