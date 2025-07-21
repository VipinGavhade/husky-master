"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthForm } from "@/components/auth/auth-form"
import { createClient } from "@/lib/supabase/client"
import { resetPasswordSchema } from "@/schemas/auth"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (data: any) => {
    try {
      setIsLoading(true)
      setError("")

      const validatedData = resetPasswordSchema.parse(data)
      const supabase = createClient()

      const { error: authError } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-muted-foreground">We've sent you a password reset link.</p>
          <Link href="/auth/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <AuthForm type="reset" onSubmit={handleResetPassword} isLoading={isLoading} error={error} />
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
