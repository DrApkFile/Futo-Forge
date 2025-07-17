"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format, isBefore, addHours, parseISO } from "date-fns"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, LinkIcon, Twitter, DollarSign, Banknote } from "lucide-react"

interface Bounty {
  id: string
  title: string
  description: string
  budget: number
  currency: string
  dueDate: string // ISO string
  skills: string[]
  status: "open" | "closed" | "cancelled"
  type: "Bounty" | "Project"
  createdAt: string // ISO string
  organizationId: string
  maxSubmissions: number
}

interface Submission {
  id: string
  bountyId: string
  participantId: string
  participantName: string
  submissionLink: string
  extraNotes?: string
  xThreadLink?: string
  submittedAt: string // ISO string
  status: "pending" | "approved" | "rejected"
}

export default function ManageBountiesPage() {
  const [user, loadingAuth] = useAuthState(auth)
  const router = useRouter()

  const [bounties, setBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedBountyForSubmissions, setSelectedBountyForSubmissions] = useState<Bounty | null>(null)
  const [submissionsForSelectedBounty, setSubmissionsForSelectedBounty] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [submissionsError, setSubmissionsError] = useState<string | null>(null)

  // State for editing bounty
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditBounty, setCurrentEditBounty] = useState<Bounty | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editBudget, setEditBudget] = useState(0)
  const [editCurrency, setEditCurrency] = useState("USD")
  const [editMaxSubmissions, setEditMaxSubmissions] = useState(1)
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [editNewSkill, setEditNewSkill] = useState("")
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin")
      return
    }
    if (user) {
      const fetchBounties = async () => {
        setLoading(true)
        setError(null)
        try {
          const q = query(collection(db, "bounties"), where("organizationId", "==", user.uid))
          const querySnapshot = await getDocs(q)
          const fetchedBounties: Bounty[] = []
          querySnapshot.forEach((doc) => {
            fetchedBounties.push({ id: doc.id, ...doc.data() } as Bounty)
          })
          setBounties(fetchedBounties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        } catch (err: any) {
          setError("Failed to fetch bounties: " + err.message)
        } finally {
          setLoading(false)
        }
      }
      fetchBounties()
    }
  }, [user, loadingAuth, router])

  const handleCancelBounty = async (bounty: Bounty) => {
    if (!user) {
      setError("User not authenticated.")
      return
    }
    try {
      const bountyRef = doc(db, "bounties", bounty.id)
      await updateDoc(bountyRef, {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
      })

      // Refund bounty budget to organization's in-app wallet
      const orgUserRef = doc(db, "users", user.uid)
      const orgDocSnap = await getDoc(orgUserRef)
      if (orgDocSnap.exists()) {
        const currentWalletBalance = orgDocSnap.data().walletBalance || 0
        await updateDoc(orgUserRef, {
          walletBalance: currentWalletBalance + bounty.budget,
        })
      }

      setBounties((prev) => prev.map((b) => (b.id === bounty.id ? { ...b, status: "cancelled" } : b)))
      alert(`Bounty "${bounty.title}" cancelled. Budget refunded to your in-app wallet.`)
    } catch (err: any) {
      setError("Failed to cancel bounty: " + err.message)
    }
  }

  const handleViewSubmissions = async (bounty: Bounty) => {
    setSelectedBountyForSubmissions(bounty)
    setLoadingSubmissions(true)
    setSubmissionsError(null)
    try {
      const q = query(collection(db, "bountySubmissions"), where("bountyId", "==", bounty.id))
      const querySnapshot = await getDocs(q)
      const fetchedSubmissions: Submission[] = []
      querySnapshot.forEach((doc) => {
        fetchedSubmissions.push({ id: doc.id, ...doc.data() } as Submission)
      })
      setSubmissionsForSelectedBounty(
        fetchedSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
      )
    } catch (err: any) {
      setSubmissionsError("Failed to fetch submissions: " + err.message)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const canEditBounty = (bounty: Bounty) => {
    const createdAtDate = parseISO(bounty.createdAt)
    const oneHourAfterCreation = addHours(createdAtDate, 1)
    const now = new Date()
    // Can edit if within 1 hour of creation AND no submissions AND status is open
    return isBefore(now, oneHourAfterCreation) && bounty.status === "open" && submissionsForSelectedBounty.length === 0
  }

  const handleEditBountyClick = (bounty: Bounty) => {
    setCurrentEditBounty(bounty)
    setEditTitle(bounty.title)
    setEditDescription(bounty.description)
    setEditBudget(bounty.budget)
    setEditCurrency(bounty.currency)
    setEditMaxSubmissions(bounty.maxSubmissions)
    setEditSkills(bounty.skills)
    setEditNewSkill("")
    setEditError(null)
    setEditSuccess(null)
    setIsEditing(true)
  }

  const handleAddEditSkill = () => {
    if (editNewSkill.trim() && !editSkills.includes(editNewSkill.trim())) {
      setEditSkills([...editSkills, editNewSkill.trim()])
      setEditNewSkill("")
    }
  }

  const handleRemoveEditSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter((s) => s !== skillToRemove))
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentEditBounty || !user) return

    setLoading(true)
    setEditError(null)
    setEditSuccess(null)

    try {
      const bountyRef = doc(db, "bounties", currentEditBounty.id)
      await updateDoc(bountyRef, {
        title: editTitle,
        description: editDescription,
        budget: editBudget,
        currency: editCurrency,
        maxSubmissions: editMaxSubmissions,
        skills: editSkills,
        updatedAt: serverTimestamp(),
      })
      setEditSuccess("Bounty updated successfully!")
      setIsEditing(false)
      // Refresh bounties list
      const q = query(collection(db, "bounties"), where("organizationId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const fetchedBounties: Bounty[] = []
      querySnapshot.forEach((doc) => {
        fetchedBounties.push({ id: doc.id, ...doc.data() } as Bounty)
      })
      setBounties(fetchedBounties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (err: any) {
      setEditError("Failed to update bounty: " + err.message)
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

  const openBounties = bounties.filter((b) => b.status === "open")
  const closedBounties = bounties.filter((b) => b.status === "closed")
  const cancelledBounties = bounties.filter((b) => b.status === "cancelled")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-bold">Manage My Bounties</CardTitle>
            <CardDescription>View, edit, and manage your posted bounties and projects.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="open" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto mb-4">
                <TabsTrigger value="open">Open ({openBounties.length})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({closedBounties.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledBounties.length})</TabsTrigger>
              </TabsList>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Loading bounties...</p>
              ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : (
                <>
                  <TabsContent value="open" className="mt-4 space-y-4">
                    {openBounties.length === 0 ? (
                      <p className="text-center text-gray-500">No open bounties found.</p>
                    ) : (
                      openBounties.map((bounty) => (
                        <BountyCard
                          key={bounty.id}
                          bounty={bounty}
                          onCancel={handleCancelBounty}
                          onViewSubmissions={handleViewSubmissions}
                          onEdit={handleEditBountyClick}
                          canEdit={canEditBounty(bounty)}
                        />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="closed" className="mt-4 space-y-4">
                    {closedBounties.length === 0 ? (
                      <p className="text-center text-gray-500">No closed bounties found.</p>
                    ) : (
                      closedBounties.map((bounty) => (
                        <BountyCard
                          key={bounty.id}
                          bounty={bounty}
                          onCancel={handleCancelBounty}
                          onViewSubmissions={handleViewSubmissions}
                          onEdit={handleEditBountyClick}
                          canEdit={canEditBounty(bounty)}
                        />
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="cancelled" className="mt-4 space-y-4">
                    {cancelledBounties.length === 0 ? (
                      <p className="text-center text-gray-500">No cancelled bounties found.</p>
                    ) : (
                      cancelledBounties.map((bounty) => (
                        <BountyCard
                          key={bounty.id}
                          bounty={bounty}
                          onCancel={handleCancelBounty}
                          onViewSubmissions={handleViewSubmissions}
                          onEdit={handleEditBountyClick}
                          canEdit={canEditBounty(bounty)}
                        />
                      ))
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Dialog */}
      <Dialog open={!!selectedBountyForSubmissions} onOpenChange={() => setSelectedBountyForSubmissions(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submissions for "{selectedBountyForSubmissions?.title}"</DialogTitle>
            <DialogDescription>Review the submissions for this bounty.</DialogDescription>
          </DialogHeader>
          {loadingSubmissions ? (
            <p className="text-center text-gray-500">Loading submissions...</p>
          ) : submissionsError ? (
            <p className="text-center text-red-500">{submissionsError}</p>
          ) : submissionsForSelectedBounty.length === 0 ? (
            <p className="text-center text-gray-500">No submissions yet for this bounty.</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {submissionsForSelectedBounty.map((submission) => (
                <Card key={submission.id} className="p-4">
                  <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
                    <CardTitle className="text-lg font-semibold">{submission.participantName}</CardTitle>
                    <Badge variant="secondary">{submission.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-0 space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {format(parseISO(submission.submittedAt), "PPP p")}
                    </p>
                    {submission.submissionLink && (
                      <p>
                        <span className="font-medium">Link:</span>{" "}
                        <a
                          href={submission.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" /> {submission.submissionLink}
                        </a>
                      </p>
                    )}
                    {submission.xThreadLink && (
                      <p>
                        <span className="font-medium">X Thread:</span>{" "}
                        <a
                          href={submission.xThreadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center"
                        >
                          <Twitter className="h-4 w-4 mr-1" /> {submission.xThreadLink}
                        </a>
                      </p>
                    )}
                    {submission.extraNotes && (
                      <p>
                        <span className="font-medium">Notes:</span> {submission.extraNotes}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-0 mt-4 flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bounty Dialog */}
      <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bounty: "{currentEditBounty?.title}"</DialogTitle>
            <DialogDescription>
              You can only edit details within 1 hour of posting and if no submissions have been made.
            </DialogDescription>
          </DialogHeader>
          {currentEditBounty && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Budget</Label>
                  <div className="flex items-center space-x-2">
                    <Select value={editCurrency} onValueChange={setEditCurrency}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" /> USD
                          </div>
                        </SelectItem>
                        <SelectItem value="NGN">
                          <div className="flex items-center">
                            <Banknote className="h-4 w-4 mr-1" /> NGN
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="edit-budget"
                      type="number"
                      value={editBudget}
                      onChange={(e) => setEditBudget(Number(e.target.value))}
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-max-submissions">Max Submissions</Label>
                  <Input
                    id="edit-max-submissions"
                    type="number"
                    value={editMaxSubmissions}
                    onChange={(e) => setEditMaxSubmissions(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-skills">Required Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0.5 rounded-full hover:bg-gray-200"
                        onClick={() => handleRemoveEditSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="edit-new-skill"
                    type="text"
                    placeholder="Add a new skill"
                    value={editNewSkill}
                    onChange={(e) => setEditNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddEditSkill()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddEditSkill}>
                    Add
                  </Button>
                </div>
              </div>
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              {editSuccess && <p className="text-green-600 text-sm">{editSuccess}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface BountyCardProps {
  bounty: Bounty
  onCancel: (bounty: Bounty) => void
  onViewSubmissions: (bounty: Bounty) => void
  onEdit: (bounty: Bounty) => void
  canEdit: boolean
}

function BountyCard({ bounty, onCancel, onViewSubmissions, onEdit, canEdit }: BountyCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <CardHeader className="p-0 mb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">{bounty.title}</CardTitle>
          <Badge
            variant={bounty.status === "open" ? "default" : bounty.status === "cancelled" ? "destructive" : "secondary"}
          >
            {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {bounty.type} • Due: {format(parseISO(bounty.dueDate), "PPP")}
        </p>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <p className="text-gray-700 text-sm line-clamp-3">{bounty.description}</p>
        <div className="flex flex-wrap gap-2">
          {bounty.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700">
          <p className="flex items-center">
            {bounty.currency === "₦" ? <Banknote className="w-4 h-4 mr-1" /> : <DollarSign className="w-4 h-4 mr-1" />}
            <span className="font-semibold">
              {bounty.budget.toLocaleString()} {bounty.currency}
            </span>
          </p>
          <p>
            Max Submissions: <span className="font-semibold">{bounty.maxSubmissions}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-0 mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewSubmissions(bounty)}>
          View Submissions
        </Button>
        {bounty.status === "open" && canEdit && (
          <Button variant="secondary" size="sm" onClick={() => onEdit(bounty)}>
            Edit
          </Button>
        )}
        {bounty.status === "open" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel this bounty?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The bounty budget of {bounty.budget} {bounty.currency} will be refunded
                  to your in-app wallet, but sparks will not be refunded.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep it</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancel(bounty)}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
}
