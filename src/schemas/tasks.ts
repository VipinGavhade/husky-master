import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  due_date: z.string().optional(),
  project_id: z.string().uuid().optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export interface Task {
  id: string
  project_id?: string
  user_id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  due_date?: string
  created_at: string
  updated_at: string
}
