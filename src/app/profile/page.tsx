"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/store/auth-store"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { User, Mail, Calendar, Edit, Save, X, Camera, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfile {
  username?: string
  full_name?: string
  avatar_url?: string
  onboarded?: boolean
  created_at?: string
}

function ProfileContent() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      const supabase = createClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (!error && data) {
        setProfile(data)
        setFormData({
          username: data.username || "",
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      username: profile?.username || "",
      full_name: profile?.full_name || "",
      avatar_url: profile?.avatar_url || "",
    })
    setError("")
    setSuccess("")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError("")
      setSuccess("")

      // Validate username
      if (formData.username && formData.username.length < 3) {
        setError("Username must be at least 3 characters long")
        return
      }

      if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        setError("Username can only contain letters, numbers, and underscores")
        return
      }

      // Validate full name
      if (formData.full_name && formData.full_name.length < 2) {
        setError("Full name must be at least 2 characters long")
        return
      }

      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("users")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (updateError) {
        if (updateError.code === "23505") {
          setError("Username already taken. Please choose a different one.")
        } else {
          setError(`Error updating profile: ${updateError.message}`)
        }
        return
      }

      // Update local state
      const updatedProfile = {
        ...profile,
        username: formData.username,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
      }
      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccess("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred while updating your profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update your account details and profile information"
                : "Your account details and profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={isEditing ? formData.avatar_url : profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isEditing ? formData.full_name || "No name set" : profile?.full_name || "No name set"}
                </h3>
                <p className="text-muted-foreground">
                  @{isEditing ? formData.username || "No username" : profile?.username || "No username"}
                </p>
                {isEditing && (
                  <p className="text-xs text-muted-foreground mt-1">Click the camera icon to change your avatar</p>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input id="email" value={user?.email || ""} disabled />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed from this page</p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={isEditing ? formData.username : profile?.username || ""}
                  onChange={(e) => isEditing && setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter your username" : "No username set"}
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Username can only contain letters, numbers, and underscores
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={isEditing ? formData.full_name : profile?.full_name || ""}
                  onChange={(e) => isEditing && setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter your full name" : "No name set"}
                />
              </div>

              {/* Join Date (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="joinDate">Member Since</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="joinDate"
                    value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""}
                    disabled
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start">
              Change Password
            </Button>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start">
              Download Data
            </Button>
            <p className="text-xs text-muted-foreground">Download a copy of your account data</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="destructive" className="justify-start">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <ProfileContent />
    </ProtectedRoute>
  )
}
