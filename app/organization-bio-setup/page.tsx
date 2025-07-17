"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

export default function OrganizationBioSetupPage() {
  const [user, loadingAuth] = useAuthState(auth)
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [niche, setNiche] = useState("")
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin") // Redirect if not authenticated
    }
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          if (userData.profileSetupComplete) {
            router.push("/dashboard") // Redirect if setup already complete
          }
          setBio(userData.bio || "")
          setWebsite(userData.website || "")
          setNiche(userData.niche || "")
          setProfilePicPreview(userData.profilePicUrl || null)
        }
      }
      fetchUserData()
    }
  }, [user, loadingAuth, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicFile(file)
      setProfilePicPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!user) {
      setError("User not authenticated.")
      setLoading(false)
      return
    }

    if (!bio.trim()) {
      setError("Bio is required.")
      setLoading(false)
      return
    }

    try {
      let uploadedProfilePicUrl = profilePicPreview // Keep existing if no new file
      if (profilePicFile) {
        const formData = new FormData()
        formData.append("file", profilePicFile)
        const uploadResponse = await fetch("/api/upload-profile-pic", {
          method: "POST",
          body: formData,
        })
        const uploadData = await uploadResponse.json()
        if (uploadData.success) {
          uploadedProfilePicUrl = uploadData.url
        } else {
          throw new Error(uploadData.error || "Failed to upload profile picture.")
        }
      }

      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        bio: bio.trim(),
        website: website.trim(),
        niche: niche.trim(),
        profilePicUrl: uploadedProfilePicUrl,
        profileSetupComplete: true,
      })

      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error saving profile:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Organization Profile</CardTitle>
          <CardDescription>Tell us more about your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-indigo-600">
                <AvatarImage src={profilePicPreview || "/placeholder.svg"} alt="Profile Picture" />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-3xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="profilePic" className="cursor-pointer flex items-center text-indigo-600 hover:underline">
                <Upload className="h-4 w-4 mr-2" /> Upload Profile Picture (Optional)
                <Input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Organization Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your organization, its mission, and what kind of talent you look for."
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-organization.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Organization Niche (e.g., "Tech", "Education", "Non-profit")</Label>
              <Input
                id="niche"
                type="text"
                placeholder="e.g., Tech"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
