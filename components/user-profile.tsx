"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, LogOut, Edit, Save, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserProfileProps {
  user: SupabaseUser
}

interface Profile {
  id: string
  name: string
  role: string
  created_at: string
}

export function UserProfile({ user }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [user.id])

  const fetchProfile = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (data) {
      setProfile(data)
      setEditedName(data.name)
    } else if (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ name: editedName }).eq("id", user.id)

    if (error) {
      setError("Failed to update profile")
    } else {
      setProfile({ ...profile, name: editedName })
      setIsEditing(false)
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(null), 3000)
    }

    setIsLoading(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleCancel = () => {
    setEditedName(profile?.name || "")
    setIsEditing(false)
    setError(null)
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Placeholder */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input id="name" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="mt-1" />
              ) : (
                <p className="mt-1 text-sm font-medium">{profile.name}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div>
              <Label>Member Since</Label>
              <p className="mt-1 text-sm text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>

            <div>
              <Label>Account Type</Label>
              <p className="mt-1 text-sm text-muted-foreground capitalize">{profile.role.toLowerCase()}</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <Alert className="border-destructive/50 text-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 text-green-700 bg-green-50">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}

            <Button variant="destructive" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
