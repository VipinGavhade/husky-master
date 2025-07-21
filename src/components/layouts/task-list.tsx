"use client"

import { useState } from "react"
import  motion from "motion/react-client"
import { supabase, type Task } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { AnimatePresence } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, Edit, Trash2, Save, X, Calendar } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: () => void
}

export function TaskList({ tasks, onTaskUpdated }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-amber-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-amber-100 text-amber-800 border-amber-200"
    }
  }

  const updateTaskStatus = async (taskId: string, status: "completed" | "cancelled" | "pending") => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) throw error
      onTaskUpdated()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error
      onTaskUpdated()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description ?? "")
  }

  const saveEdit = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: editTitle,
          description: editDescription,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      if (error) throw error
      setEditingTask(null)
      onTaskUpdated()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditTitle("")
    setEditDescription("")
  }

  if (tasks.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    {editingTask === task.id ? (
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="font-medium" />
                    ) : (
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                    )}
                  </div>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </div>
              </CardHeader>

              {(task.description || editingTask === task.id) && (
                <CardContent className="pt-0">
                  {editingTask === task.id ? (
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Task description"
                      rows={2}
                    />
                  ) : (
                    <CardDescription className="text-sm">{task.description}</CardDescription>
                  )}
                </CardContent>
              )}

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {editingTask === task.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(task.id)}>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEditing(task)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>

                      {task.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => updateTaskStatus(task.id, "completed")}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}

                      {task.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 hover:text-amber-700"
                          onClick={() => updateTaskStatus(task.id, "cancelled")}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}

                      {task.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => updateTaskStatus(task.id, "pending")}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Reopen
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
