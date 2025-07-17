"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { deleteUser, sendPasswordResetEmail } from "firebase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EditProfilePage() {
  const [user, loadingAuth] = useAuthState(auth)
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [organizationName, setOrganizationName] = useState("") // Only for display
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [githubUsername, setGithubUsername] = useState("")
  const [niches, setNiches] = useState<string[]>([])
  const [newNiche, setNewNiche] = useState("")
  const [website, setWebsite] = useState("")
  const [orgNiche, setOrgNiche] = useState("") // For organization niche

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)

  const [userType, setUserType] = useState<"participant" | "organization" | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin")
      return
    }

    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()
            setUserType(userData.userType)
            setEmail(userData.email || "")
            setProfilePicPreview(userData.profilePicUrl || null)

            if (userData.userType === "participant") {
              setUsername(userData.username || "")
              setBio(userData.bio || "")
              setGithubUsername(userData.githubUsername || "")
              setNiches(userData.niches || [])
            } else if (userData.userType === "organization") {
              setOrganizationName(userData.organizationName || "") // Display only
              setBio(userData.bio || "")
              setWebsite(userData.website || "")
              setOrgNiche(userData.niche || "")
            }
          } else {
            setError("User profile not found.")
          }
        } catch (err: any) {
          setError("Failed to fetch user data: " + err.message)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [user, loadingAuth, router])

  const handleAddNiche = () => {
    if (newNiche.trim() && !niches.includes(newNiche.trim())) {
      setNiches([...niches, newNiche.trim()])
      setNewNiche("")
    }
  }

  const handleRemoveNiche = (nicheToRemove: string) => {
    setNiches(niches.filter((n) => n !== nicheToRemove))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicFile(file)
      setProfilePicPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    setError(null)
    setSuccess(null)

    if (!user) {
      setError("User not authenticated.")
      setSaveLoading(false)
      return
    }

    try {
      // Handle profile picture upload
      let uploadedProfilePicUrl = profilePicPreview
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

      // Update Firestore document
      const userDocRef = doc(db, "users", user.uid)
      const updateData: { [key: string]: any } = {
        profilePicUrl: uploadedProfilePicUrl,
        bio: bio.trim(),
      }

      if (userType === "participant") {
        updateData.username = username.trim()
        updateData.githubUsername = githubUsername.trim()
        updateData.niches = niches
      } else if (userType === "organization") {
        updateData.website = website.trim()
        updateData.niche = orgNiche.trim()
      }

      await updateDoc(userDocRef, updateData)
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      console.error("Error saving profile:", err)
      setError(err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleChangeEmailPassword = async (type: "email" | "password") => {
    if (!user) {
      setError("User not authenticated.")
      return
    }
    setSuccess(null)
    setError(null)

    try {
      await sendPasswordResetEmail(auth, user.email!)
      setSuccess(`A password reset link has been sent to ${user.email}. Please use it to update your ${type}.`)
    } catch (err: any) {
      console.error(`Error sending password reset for ${type}:`, err)
      setError(`Failed to send password reset link: ${err.message}`)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) {
      setError("User not authenticated.")
      return
    }
    setSaveLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", user.uid))

      // Delete user from Firebase Authentication
      await deleteUser(user)

      setSuccess("Account deleted successfully. Redirecting...")
      router.push("/signup") // Redirect to signup page after deletion
    } catch (err: any) {
      console.error("Error deleting account:", err)
      setError(
        `Failed to delete account: ${err.message}. You might need to re-authenticate by logging in again if this error persists.`,
      )
    } finally {
      setSaveLoading(false)
    }
  }

  if (loadingAuth || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>Loading profile data...</p>
      </div>
    )
  }

  if (error && !success) {
    // Only show error if no success message is present
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-2 border-indigo-600">
                  <AvatarImage src={profilePicPreview || "/placeholder.svg"} alt="Profile Picture" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-3xl font-bold">
                    {(username || organizationName || user?.email?.charAt(0))?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profilePic"
                  className="cursor-pointer flex items-center text-indigo-600 hover:underline"
                >
                  <Upload className="h-4 w-4 mr-2" /> Change Profile Picture
                  <Input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </Label>
              </div>

              {userType === "participant" && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}

              {userType === "organization" && (
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    value={organizationName}
                    disabled // Organization name is not editable
                    className="bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500">Organization name cannot be changed.</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled className="bg-gray-100 cursor-not-allowed" />
                <Button
                  variant="link"
                  type="button"
                  onClick={() => handleChangeEmailPassword("email")}
                  className="p-0 h-auto"
                >
                  Change Email (via password reset)
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value="********"
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <Button
                  variant="link"
                  type="button"
                  onClick={() => handleChangeEmailPassword("password")}
                  className="p-0 h-auto"
                >
                  Change Password (via password reset)
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself or your organization."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {userType === "participant" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="githubUsername">GitHub Username (Optional)</Label>
                    <Input
                      id="githubUsername"
                      type="text"
                      placeholder="e.g., octocat"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niches">Niches/Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {niches.map((niche, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {niche}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0.5 rounded-full hover:bg-gray-200"
                            onClick={() => handleRemoveNiche(niche)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {niche}</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        id="newNiche"
                        type="text"
                        placeholder="Add a new niche (e.g., 'Web Development')"
                        value={newNiche}
                        onChange={(e) => setNewNiche(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddNiche()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddNiche}>
                        Add
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {userType === "organization" && (
                <>
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
                    <Label htmlFor="orgNiche">Organization Niche (e.g., "Tech", "Education")</Label>
                    <Input
                      id="orgNiche"
                      type="text"
                      placeholder="e.g., Tech"
                      value={orgNiche}
                      onChange={(e) => setOrgNiche(e.target.value)}
                    />
                  </div>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <Button type="submit" className="w-full" disabled={saveLoading}>
                {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" disabled={saveLoading}>
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={saveLoading}>
                      {saveLoading ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
