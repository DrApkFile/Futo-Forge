"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { collection, query, where, getDocs, doc, updateDoc, orderBy, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format, parseISO, subDays } from "date-fns"
import { Ban, DollarSign, Banknote, Users, Flag, Briefcase, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar" // Import Sidebar components

interface UserData {
  uid: string
  username?: string
  organizationName?: string
  email: string
  userType: "participant" | "organization" | "admin"
  profilePicUrl?: string
  status?: "active" | "banned" | "deleted"
  createdAt: string
  walletBalance?: number // For organizations
}

interface ReportData {
  id: string
  reportedBy: string
  reportedUserUid: string
  reportedUserName: string
  reason: string
  message: string
  createdAt: string
  status: "pending" | "reviewed" | "dismissed"
}

interface BountyData {
  id: string
  title: string
  organizationName: string
  budget: number
  currency: string
  status: "open" | "closed" | "cancelled"
  createdAt: string
  type: "Bounty" | "Project"
  organizationId: string
}

export default function AdminPage() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState("users") // State to control active tab/sidebar item

  const [allUsers, setAllUsers] = useState<UserData[]>([])
  const [allReports, setAllReports] = useState<ReportData[]>([])
  const [newBounties, setNewBounties] = useState<BountyData[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)

  // Hardcoded admin credentials for demo
  const ADMIN_USERNAME = "admin"
  const ADMIN_PASSWORD = "250107Ken"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setLoggedIn(true)
      // In a real app, you'd sign in the user with Firebase Auth here
      // and then check their userType from Firestore to confirm admin status.
      // For this demo, we assume successful login means they are the hardcoded admin.
    } else {
      setLoginError("Invalid username or password.")
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setAdminUsername("")
    setAdminPassword("")
    router.push("/admin") // Redirect to login page
  }

  useEffect(() => {
    if (loggedIn) {
      fetchAllData()
    }
  }, [loggedIn])

  const fetchAllData = async () => {
    setLoadingData(true)
    setDataError(null)
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const usersList: UserData[] = []
      usersSnapshot.forEach((doc) => {
        usersList.push({ uid: doc.id, ...doc.data() } as UserData)
      })
      setAllUsers(usersList)

      // Fetch all reports
      const reportsSnapshot = await getDocs(collection(db, "reports"))
      const reportsList: ReportData[] = []
      reportsSnapshot.forEach((doc) => {
        reportsList.push({ id: doc.id, ...doc.data() } as ReportData)
      })
      setAllReports(reportsList)

      // Fetch newly created bounties (last 24 hours)
      const twentyFourHoursAgo = subDays(new Date(), 1)
      const bountiesQ = query(
        collection(db, "bounties"),
        where("createdAt", ">=", twentyFourHoursAgo.toISOString()),
        orderBy("createdAt", "desc"),
      )
      const bountiesSnapshot = await getDocs(bountiesQ)
      const newBountiesList: BountyData[] = []
      bountiesSnapshot.forEach((doc) => {
        newBountiesList.push({ id: doc.id, ...doc.data() } as BountyData)
      })
      setNewBounties(newBountiesList)
    } catch (err: any) {
      setDataError("Failed to fetch data: " + err.message)
    } finally {
      setLoadingData(false)
    }
  }

  const handleBanUser = async (userToBan: UserData) => {
    try {
      const userRef = doc(db, "users", userToBan.uid)
      await updateDoc(userRef, {
        status: "banned",
        bannedAt: new Date().toISOString(),
      })

      // If user is an organization, cancel their open bounties and refund budget
      if (userToBan.userType === "organization") {
        const openBountiesQ = query(
          collection(db, "bounties"),
          where("organizationId", "==", userToBan.uid),
          where("status", "==", "open"),
        )
        const openBountiesSnapshot = await getDocs(openBountiesQ)

        for (const bountyDoc of openBountiesSnapshot.docs) {
          const bounty = bountyDoc.data() as BountyData
          const bountyRef = doc(db, "bounties", bounty.id)
          await updateDoc(bountyRef, {
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
          })

          // Refund bounty budget to organization's in-app wallet
          const orgUserRef = doc(db, "users", userToBan.uid)
          const orgDocSnap = await getDoc(orgUserRef)
          if (orgDocSnap.exists()) {
            const currentWalletBalance = orgDocSnap.data().walletBalance || 0
            await updateDoc(orgUserRef, {
              walletBalance: currentWalletBalance + bounty.budget,
            })
          }
        }
      }

      setAllUsers((prev) => prev.map((u) => (u.uid === userToBan.uid ? { ...u, status: "banned" } : u)))
      alert(`${userToBan.username || userToBan.organizationName} has been banned.`)
    } catch (err: any) {
      setDataError("Failed to ban user: " + err.message)
    }
  }

  const handleUnbanUser = async (userToUnban: UserData) => {
    try {
      const userRef = doc(db, "users", userToUnban.uid)
      await updateDoc(userRef, {
        status: "active",
        bannedAt: null,
      })
      setAllUsers((prev) => prev.map((u) => (u.uid === userToUnban.uid ? { ...u, status: "active" } : u)))
      alert(`${userToUnban.username || userToUnban.organizationName} has been unbanned.`)
    } catch (err: any) {
      setDataError("Failed to unban user: " + err.message)
    }
  }

  const handleCancelBountyAdmin = async (bounty: BountyData) => {
    try {
      const bountyRef = doc(db, "bounties", bounty.id)
      await updateDoc(bountyRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      })

      // Refund bounty budget to organization's in-app wallet
      const orgUserRef = doc(db, "users", bounty.organizationId)
      const orgDocSnap = await getDoc(orgUserRef)
      if (orgDocSnap.exists()) {
        const currentWalletBalance = orgDocSnap.data().walletBalance || 0
        await updateDoc(orgUserRef, {
          walletBalance: currentWalletBalance + bounty.budget,
        })
      }

      setNewBounties((prev) => prev.map((b) => (b.id === bounty.id ? { ...b, status: "cancelled" } : b)))
      alert(`Bounty "${bounty.title}" cancelled and budget refunded.`)
    } catch (err: any) {
      setDataError("Failed to cancel bounty: " + err.message)
    }
  }

  const handleMarkReportReviewed = async (report: ReportData) => {
    try {
      const reportRef = doc(db, "reports", report.id)
      await updateDoc(reportRef, {
        status: "reviewed",
        reviewedAt: new Date().toISOString(),
      })
      setAllReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: "reviewed" } : r)))
      alert("Report marked as reviewed.")
    } catch (err: any) {
      setDataError("Failed to mark report as reviewed: " + err.message)
    }
  }

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>Enter admin credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="admin"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        {" "}
        {/* Collapsible sidebar */}
        <SidebarHeader className="p-4">
          <h2 className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Admin Panel
          </h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")}>
                    <Flag />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "new-bounties"}
                    onClick={() => setActiveTab("new-bounties")}
                  >
                    <Briefcase />
                    <span>New Bounties</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-xl border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>Manage users, reports, and bounties.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <p className="text-center text-gray-500 py-8">Loading data...</p>
            ) : dataError ? (
              <p className="text-center text-red-500 py-8">{dataError}</p>
            ) : (
              <>
                {activeTab === "users" && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">All Users ({allUsers.length})</h3>
                    {allUsers.length === 0 ? (
                      <p className="text-center text-gray-500">No users found.</p>
                    ) : (
                      allUsers.map((userItem) => (
                        <div
                          key={userItem.uid}
                          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={userItem.profilePicUrl || "/placeholder.svg"}
                                alt={userItem.username || userItem.organizationName}
                              />
                              <AvatarFallback>
                                {(userItem.username || userItem.organizationName)?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {userItem.username || userItem.organizationName}
                              </h3>
                              <p className="text-gray-600 text-sm truncate">{userItem.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{userItem.userType}</Badge>
                                <Badge variant={userItem.status === "banned" ? "destructive" : "secondary"}>
                                  {userItem.status || "active"}
                                </Badge>
                                {userItem.userType === "organization" && (
                                  <Badge variant="outline" className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1" /> {userItem.walletBalance || 0}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {userItem.status !== "banned" ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Ban className="h-4 w-4 mr-1" /> Ban
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to ban this user?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will ban {userItem.username || userItem.organizationName} from the platform.
                                      If they are an organization, all their open bounties will be cancelled and
                                      refunded to their in-app wallet.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleBanUser(userItem)}>
                                      Confirm Ban
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => handleUnbanUser(userItem)}>
                                Unban
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">All Reports ({allReports.length})</h3>
                    {allReports.length === 0 ? (
                      <p className="text-center text-gray-500">No reports found.</p>
                    ) : (
                      allReports.map((report) => (
                        <Card key={report.id} className="p-4">
                          <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
                            <CardTitle className="text-lg font-semibold">
                              Report on: {report.reportedUserName}
                            </CardTitle>
                            <Badge variant={report.status === "pending" ? "default" : "secondary"}>
                              {report.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-0 space-y-2 text-sm text-gray-700">
                            <p>
                              <span className="font-medium">Reason:</span> {report.reason}
                            </p>
                            {report.message && (
                              <p>
                                <span className="font-medium">Details:</span> {report.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Reported by: {report.reportedBy} on {format(parseISO(report.createdAt), "PPP p")}
                            </p>
                          </CardContent>
                          <CardFooter className="p-0 mt-4 flex justify-end">
                            {report.status === "pending" && (
                              <Button size="sm" onClick={() => handleMarkReportReviewed(report)}>
                                Mark as Reviewed
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "new-bounties" && (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-xl font-semibold mb-4">
                      Newly Created Bounties (Last 24h) ({newBounties.length})
                    </h3>
                    {newBounties.length === 0 ? (
                      <p className="text-center text-gray-500">No new bounties in the last 24 hours.</p>
                    ) : (
                      newBounties.map((bounty) => (
                        <div
                          key={bounty.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">{bounty.title}</h3>
                              <p className="text-gray-600 text-sm">
                                {bounty.organizationName} • {bounty.type}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                {bounty.currency === "₦" ? (
                                  <Banknote className="w-4 h-4 mr-1 text-green-600" />
                                ) : (
                                  <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                                )}
                                {bounty.budget} {bounty.currency} • Status: {bounty.status}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4">
                            {bounty.status !== "cancelled" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    Cancel Bounty
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to cancel this bounty?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will cancel the bounty "{bounty.title}". The budget of {bounty.budget}{" "}
                                      {bounty.currency} will be refunded to the organization's in-app wallet. Sparks
                                      will NOT be refunded.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No, keep it</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelBountyAdmin(bounty)}>
                                      Yes, cancel
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarProvider>
  )
}
