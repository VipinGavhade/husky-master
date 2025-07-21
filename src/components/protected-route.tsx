"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export function ProtectedRoute({ children, requireOnboarding = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, setUser, isOnboarded, setOnboarded } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Check if user has completed onboarding
      const { data: profile } = await supabase.from("users").select("onboarded").eq("id", user.id).single()

      const userOnboarded = profile?.onboarded || false
      setOnboarded(userOnboarded)

      if (requireOnboarding && !userOnboarded) {
        router.push("/auth/onboarding")
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, setUser, setOnboarded, requireOnboarding])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
