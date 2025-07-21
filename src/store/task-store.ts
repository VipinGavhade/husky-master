import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/schemas/tasks"

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchTasks: () => Promise<void>
  createTask: (task: CreateTaskInput) => Promise<void>
  updateTask: (task: UpdateTaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setError: (error: string | null) => void
  clearError: () => void
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()

      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

      if (error) throw error

      set({ tasks: data || [], isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  createTask: async (taskData: CreateTaskInput) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: user.id,
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
        })
        .select()
        .single()

      if (error) throw error

      const currentTasks = get().tasks
      set({
        tasks: [data, ...currentTasks],
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateTask: async (taskData: UpdateTaskInput) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()

      const { data, error } = await supabase
        .from("tasks")
        .update({
          ...taskData,
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskData.id)
        .select()
        .single()

      if (error) throw error

      const currentTasks = get().tasks
      const updatedTasks = currentTasks.map((task) => (task.id === taskData.id ? data : task))

      set({ tasks: updatedTasks, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = createClient()

      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) throw error

      const currentTasks = get().tasks
      const filteredTasks = currentTasks.filter((task) => task.id !== id)

      set({ tasks: filteredTasks, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}))
