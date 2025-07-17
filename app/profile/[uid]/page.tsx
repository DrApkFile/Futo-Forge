"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Trophy, Github, Mail, Flag, XCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDoc, collection } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { Label } from "@/components/ui/label"

interface UserProfile {
  username?: string
  email: string
  profilePicUrl?: string
  bio?: string
  githubUsername?: string
  niches?: string[]
  totalEarnings?: number
  bountiesParticipated?: number
  bountiesWon?: number
  userType: "participant" | "organization"
  organizationName?: string
  website?: string
  niche?: string // For organization niche
  bountiesHosted?: number // Simulated for organizations
  pendingBounties?: number // Simulated for organizations
  cancelledBounties?: number // Simulated for organizations
}

export default function UserProfilePage() {
  const { uid } = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportMessage, setReportMessage] = useState("")
  const [isReporting, setIsReporting] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reportSuccess, setReportSuccess] = useState<string | null>(null)

  const [currentUser] = useAuthState(auth)

  const reportReasons = [
    "Inappropriate Content",
    "Spam/Scam",
    "Harassment/Hate Speech",
    "Misleading Information",
    "Intellectual Property Violation",
    "Other",
  ]

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsReporting(true)
    setReportError(null)
    setReportSuccess(null)

    if (!currentUser) {
      setReportError("You must be logged in to report a profile.")
      setIsReporting(false)
      return
    }

    if (!reportReason && !reportMessage.trim()) {
      setReportError("Please select a reason or provide a message.")
      setIsReporting(false)
      return
    }

    try {
      await addDoc(collection(db, "reports"), {
        reportedBy: currentUser.uid,
        reportedUserUid: uid,
        reportedUserName: profile?.username || profile?.organizationName,
        reason: reportReason,
        message: reportMessage.trim(),
        createdAt: new Date().toISOString(),
        status: "pending", // pending, reviewed, dismissed
      })
      setReportSuccess("Report submitted successfully. Thank you for your feedback!")
      setReportReason("")
      setReportMessage("")
      setTimeout(() => setShowReportDialog(false), 2000) // Close after 2 seconds
    } catch (err: any) {
      setReportError("Failed to submit report: " + err.message)
    } finally {
      setIsReporting(false)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) {
        setError("User ID not provided.")
        setLoading(false)
        return
      }

      try {
        const userDocRef = doc(db, "users", uid as string)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          setProfile(userDocSnap.data() as UserProfile)
        } else {
          setError("Profile not found.")
        }
      } catch (err: any) {
        setError("Failed to fetch profile: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [uid])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>No profile data available.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <CardHeader className="flex flex-col items-center text-center p-0 mb-6">
            <Avatar className="h-32 w-32 mb-4 border-4 border-indigo-600">
              <AvatarImage
                src={profile.profilePicUrl || "/placeholder.svg"}
                alt={profile.username || profile.organizationName}
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-4xl font-bold">
                {(profile.username || profile.organizationName)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {profile.username || profile.organizationName}
            </CardTitle>
            {profile.userType === "participant" && profile.niches && profile.niches.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {profile.niches.map((niche, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {niche}
                  </Badge>
                ))}
              </div>
            )}
            {profile.userType === "organization" && profile.niche && (
              <Badge variant="secondary" className="text-sm mt-2">
                Niche: {profile.niche}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            {profile.bio && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {profile.userType === "participant" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{profile.bountiesParticipated || 0}</p>
                    <p className="text-sm text-gray-600">Bounties Participated</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{profile.bountiesWon || 0}</p>
                    <p className="text-sm text-gray-600">Bounties Won</p>
                  </div>
                </div>
              </div>
            )}

            {profile.userType === "organization" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{profile.bountiesHosted || 0}</p>
                    <p className="text-sm text-gray-600">Bounties Hosted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{profile.pendingBounties || 0}</p>
                    <p className="text-sm text-gray-600">Pending Bounties</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg col-span-2">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{profile.cancelledBounties || 0}</p>
                    <p className="text-sm text-gray-600">Cancelled Bounties</p>
                  </div>
                </div>
              </div>
            )}

            {(profile.githubUsername || profile.website) && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Links</h3>
                <div className="flex flex-wrap gap-4">
                  {profile.githubUsername && (
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-indigo-600 hover:underline"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-indigo-600 hover:underline"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact</h3>
              <div className="flex items-center space-x-2 text-gray-700">
                <Mail className="h-5 w-5" />
                <span>{profile.email}</span>
              </div>
              {currentUser &&
                currentUser.uid !== uid && ( // Only show message/report if not viewing own profile
                  <>
                    <Button
                      className="mt-4"
                      onClick={() => alert(`Simulating message to ${profile.username || profile.organizationName}`)}
                    >
                      Message {profile.username || profile.organizationName}
                    </Button>

                    <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 ml-2 bg-transparent">
                          <Flag className="h-4 w-4 mr-2" /> Report Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report {profile.username || profile.organizationName}</DialogTitle>
                          <DialogDescription>
                            Please provide details about why you are reporting this profile.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleReportSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="report-reason">Reason for Report</Label>
                            <Select value={reportReason} onValueChange={setReportReason}>
                              <SelectTrigger id="report-reason">
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {reportReasons.map((reason) => (
                                  <SelectItem key={reason} value={reason}>
                                    {reason}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="report-message">Additional Details (Optional)</Label>
                            <Textarea
                              id="report-message"
                              placeholder="Provide any additional information here."
                              value={reportMessage}
                              onChange={(e) => setReportMessage(e.target.value)}
                              rows={4}
                            />
                          </div>
                          {reportError && <p className="text-red-500 text-sm">{reportError}</p>}
                          {reportSuccess && <p className="text-green-600 text-sm">{reportSuccess}</p>}
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowReportDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isReporting}>
                              {isReporting ? "Submitting..." : "Submit Report"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
