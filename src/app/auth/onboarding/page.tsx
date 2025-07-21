"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { OnboardingForm } from "@/components/auth/onboarding-form"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"
import { onboardingSchema } from "@/schemas/auth"

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, setOnboarded } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleOnboarding = async (data: any) => {
    try {
      setIsLoading(true)
      setError("")

      const validatedData = onboardingSchema.parse(data)
      const supabase = createClient()

      // Update user profile in the users table
      const { error: updateError } = await supabase.from("users").upsert({
        id: user?.id,
        email: user?.email,
        username: validatedData.username,
        full_name: validatedData.fullName,
        avatar_url: validatedData.avatar,
        onboarded: true,
        updated_at: new Date().toISOString(),
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setOnboarded(true)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "An error occurred during onboarding")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <AuthLayout>
      <OnboardingForm onSubmit={handleOnboarding} isLoading={isLoading} error={error} />
    </AuthLayout>
  )
}
