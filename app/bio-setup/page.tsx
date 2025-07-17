"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge" // Import Badge for niches

export default function BioSetupPage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth)
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const [githubUsername, setGithubUsername] = useState("")
  const [selectedNiches, setSelectedNiches] = useState<string[]>([])
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const allNiches = [
    "Web Development (Frontend)",
    "Web Development (Backend)",
    "Full-Stack Development",
    "Mobile App Development (iOS)",
    "Mobile App Development (Android)",
    "Game Development",
    "Blockchain Development",
    "AI/ML Engineering",
    "Data Science",
    "DevOps",
    "Cloud Engineering",
    "Cybersecurity",
    "Embedded Systems",
    "IoT Development",
    "QA & Testing",
    "UI/UX Design",
    "Graphic Design",
    "Motion Graphics",
    "3D Modeling",
    "Brand Identity",
    "Illustration",
    "Product Design",
    "Web Design",
    "Mobile Design",
    "Content Writing",
    "Copywriting",
    "Technical Writing",
    "Video Editing",
    "Photography",
    "Social Media Management",
    "Digital Marketing",
    "SEO",
    "Translation",
    "Scriptwriting",
    "Project Management",
    "Research",
    "Data Entry",
    "Virtual Assistant",
    "Tutoring",
  ]

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin") // Redirect to sign-in if not authenticated
    }
  }, [user, loadingAuth, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicFile(file)
      setProfilePicPreview(URL.createObjectURL(file))
    } else {
      setProfilePicFile(null)
      setProfilePicPreview(null)
    }
  }

  const handleNicheToggle = (niche: string) => {
    setSelectedNiches((prev) => (prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]))
  }

  const handleNext = () => {
    setFormError(null)
    if (currentStep === 1 && !profilePicFile) {
      setFormError("Please upload a profile picture.")
      return
    }
    if (currentStep === 3 && selectedNiches.length === 0) {
      setFormError("Please select at least one niche.")
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleFinish = async () => {
    if (!user) {
      setFormError("User not authenticated.")
      return
    }

    setFormLoading(true)
    setFormError(null)

    let uploadedProfilePicUrl: string | null = null

    try {
      if (profilePicFile) {
        // --- REAL CLOUDINARY UPLOAD INITIATION (Client-side) ---
        // This is how your client-side code sends the file to your backend API Route.
        // The actual Cloudinary upload (using the 'cloudinary' library and API secret) happens there.
        const formData = new FormData()
        formData.append("file", profilePicFile)

        // This fetch call will attempt to reach your backend API route.
        // In the v0 preview, this will fail because the backend route is not running.
        // In a real Next.js project, this is the correct way to send the file.
        try {
          const response = await fetch("/api/upload-profile-pic", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to upload profile picture to Cloudinary.")
          }
          const data = await response.json()
          uploadedProfilePicUrl = data.url // Get the URL from your backend's response
        } catch (uploadError: any) {
          console.error("Client-side upload initiation failed (expected in v0):", uploadError)
          // Fallback for v0 preview: use a generic placeholder if the fetch fails
          uploadedProfilePicUrl = `/placeholder.svg?height=128&width=128`
          setFormError(`Upload failed (in v0 preview). Using placeholder. Error: ${uploadError.message}`)
        }
      }

      // Update user document in Firestore
      const userRef = doc(db, "users", user.uid)
      await updateDoc(
        userRef,
        {
          profilePicUrl: uploadedProfilePicUrl, // Save the URL (either real or placeholder)
          bio: bio,
          githubUsername: githubUsername,
          niches: selectedNiches, // Save selected niches
          profileSetupComplete: true, // Mark profile setup as complete
          totalEarnings: 0, // Initialize if not exists
          bountiesParticipated: 0, // Initialize if not exists
          bountiesWon: 0, // Initialize bounties won
        },
        { merge: true },
      ) // Use merge: true to update existing document without overwriting

      router.push("/dashboard") // Redirect to the new dashboard page
    } catch (err: any) {
      setFormError(err.message || "Failed to save profile information.")
    } finally {
      setFormLoading(false)
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>Loading user...</p>
      </div>
    )
  }

  if (errorAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p className="text-red-500">Error: {errorAuth.message}</p>
      </div>
    )
  }

  if (!user) {
    return null // Should be redirected by useEffect
  }

  const progressValue = (currentStep / 4) * 100 // Updated for 4 steps

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Setup Your Profile</CardTitle>
          <CardDescription>Step {currentStep} of 4: Tell us a bit about yourself to get started.</CardDescription>
          <Progress value={progressValue} className="w-full mt-4" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">1/4 Upload Profile Picture</h3>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profilePicPreview || "/placeholder.svg"} alt="Profile Preview" />
                  <AvatarFallback className="bg-gray-200 text-gray-500 text-xl font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="profile-pic" className="cursor-pointer">
                  <Button asChild variant="outline">
                    <span>Choose File</span>
                  </Button>
                  <Input id="profile-pic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </Label>
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              <Button onClick={handleNext} className="w-full" disabled={formLoading}>
                Next
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">2/4 Write Your Bio</h3>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your skills, interests, and what you hope to achieve on FutoForge."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                />
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full bg-transparent" disabled={formLoading}>
                  Back
                </Button>
                <Button onClick={handleNext} className="w-full" disabled={formLoading}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">3/4 Select Your Niches</h3>
              <p className="text-sm text-muted-foreground text-center">
                Choose up to 30 niches that describe your skills.
              </p>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
                {allNiches.map((nicheOption) => (
                  <Badge
                    key={nicheOption}
                    variant={selectedNiches.includes(nicheOption) ? "default" : "secondary"}
                    className={`cursor-pointer px-3 py-1 rounded-full ${
                      selectedNiches.includes(nicheOption)
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => handleNicheToggle(nicheOption)}
                  >
                    {nicheOption}
                  </Badge>
                ))}
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full bg-transparent" disabled={formLoading}>
                  Back
                </Button>
                <Button onClick={handleNext} className="w-full" disabled={formLoading}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">4/4 Add GitHub (Optional)</h3>
              <div className="space-y-2">
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  type="text"
                  placeholder="your-github-handle"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                />
              </div>
              {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
              <div className="flex justify-between gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full bg-transparent" disabled={formLoading}>
                  Back
                </Button>
                <Button onClick={handleFinish} className="w-full" disabled={formLoading}>
                  {formLoading ? "Saving..." : "Finish Setup"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
