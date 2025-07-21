"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTaskStore } from "@/store/task-store"
import { TaskActions } from "./task-actions"
import { EditTaskDialog } from "./edit-task-dialog"
import { Loader2 } from "lucide-react"
import type { Task } from "@/schemas/tasks"

interface TaskListProps {
  initialTasks: Task[]
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { tasks, isLoading } = useTaskStore()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    // Initialize store with server data
    useTaskStore.setState({ tasks: initialTasks })
  }, [initialTasks])

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowEditDialog(true)
  }

  const handleEditDialogClose = () => {
    setShowEditDialog(false)
    setEditingTask(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableCaption>
          {tasks.length === 0 ? "No tasks found. Create your first task!" : "List of your tasks"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={task.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={task.description || "No description"}>
                  {task.description || "No description"}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>
                {task.due_date ? (
                  <div className="text-sm">
                    <div>{formatDate(task.due_date)}</div>
                    <div className="text-muted-foreground text-xs">{new Date(task.due_date).toLocaleTimeString()}</div>
                  </div>
                ) : (
                  "No due date"
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{formatDate(task.created_at)}</div>
                  <div className="text-muted-foreground text-xs">{new Date(task.created_at).toLocaleTimeString()}</div>
                </div>
              </TableCell>
              <TableCell>
                <TaskActions task={task} onEdit={handleEdit} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditTaskDialog task={editingTask} open={showEditDialog} onOpenChange={handleEditDialogClose} />
    </>
  )
}
