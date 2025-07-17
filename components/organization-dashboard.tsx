"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, Briefcase, Trophy, Mail, Wallet } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Talent {
  uid: string
  username: string
  profilePicUrl?: string
  bio?: string
  githubUsername?: string
  niches?: string[]
  totalEarnings?: number
  bountiesParticipated?: number
  bountiesWon?: number
}

export function OrganizationDashboard() {
  const [user, loadingAuth] = useAuthState(auth)
  const [organizationName, setOrganizationName] = useState("Organization")
  const [trendingTalents, setTrendingTalents] = useState<Talent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Talent[]>([])
  const [messages, setMessages] = useState<string[]>([]) // Simulated messages
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setOrganizationName(userData.organizationName || "Organization")
          setWalletBalance(userData.walletBalance || 0) // Fetch wallet balance
        }
      }
    }
    fetchOrganizationData()
  }, [user])

  useEffect(() => {
    const fetchTrendingTalents = async () => {
      // Fetch users who have completed their profile and sort by totalEarnings (simulated "trending")
      const q = query(
        collection(db, "users"),
        where("userType", "==", "participant"),
        where("profileSetupComplete", "==", true),
        orderBy("totalEarnings", "desc"), // Order by earnings for "trending"
        limit(5),
      )
      const querySnapshot = await getDocs(q)
      const talents: Talent[] = []
      querySnapshot.forEach((doc) => {
        talents.push({ uid: doc.id, ...doc.data() } as Talent)
      })
      setTrendingTalents(talents)
    }
    fetchTrendingTalents()

    // Simulate messages
    setMessages([
      "You have a new message from John Doe regarding 'Web Development Bounty'.",
      "Reminder: Your 'Campus Cleanup' bounty proposal is due tomorrow.",
      "Congratulations! Your 'FUTO App Design' bounty has been approved.",
    ])
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const usersRef = collection(db, "users")
    const results: Talent[] = []

    // Search by username (prefix match)
    const qUsername = query(
      usersRef,
      where("userType", "==", "participant"),
      where("username", ">=", lowerCaseSearchTerm),
      where("username", "<=", lowerCaseSearchTerm + "\uf8ff"),
      limit(5), // Limit suggestions
    )
    const snapshotUsername = await getDocs(qUsername)
    snapshotUsername.forEach((doc) => {
      results.push({ uid: doc.id, ...doc.data() } as Talent)
    })

    // Search by niches (array-contains) - combine with username results
    const qNiches = query(
      usersRef,
      where("userType", "==", "participant"),
      where("niches", "array-contains", searchTerm), // Exact match for niche
      limit(5), // Limit suggestions
    )
    const snapshotNiches = await getDocs(qNiches)
    snapshotNiches.forEach((doc) => {
      // Avoid duplicates
      if (!results.some((r) => r.uid === doc.id)) {
        results.push({ uid: doc.id, ...doc.data() } as Talent)
      }
    })

    setSearchResults(results)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch()
    }, 300) // Debounce time

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const handleMessageTalent = (talentName: string) => {
    alert(`Simulating message to ${talentName}.`)
    // In a real app, this would open a chat interface or compose a new message.
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column - Organization Overview */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <CardContent className="flex items-center space-x-4 p-0">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src="/placeholder.svg" alt={organizationName} />
              <AvatarFallback className="bg-white text-indigo-600 text-xl font-bold">
                {organizationName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">Welcome, {organizationName}</h2>
              <p className="text-indigo-100">Manage your bounties and discover top talent.</p>
            </div>
          </CardContent>
        </Card>

        {/* Talent Search */}
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Find Talent</CardTitle>
          </CardHeader>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by username or niche (e.g., 'frontend dev', 'content writer')"
                className="pl-9 pr-3 py-2 rounded-md text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {searchTerm.trim() !== "" && searchResults.length === 0 ? (
            <div className="mt-4 text-center text-gray-500">No matching users found.</div>
          ) : (
            searchResults.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold text-gray-800">Search Results:</h4>
                {searchResults.map((talent) => (
                  <div key={talent.uid} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={talent.profilePicUrl || "/placeholder.svg"} alt={talent.username} />
                        <AvatarFallback>{talent.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/profile/${talent.uid}`} className="font-medium text-gray-900 hover:underline">
                          {talent.username}
                        </Link>
                        <p className="text-sm text-gray-600 line-clamp-1">{talent.bio}</p>
                        {talent.niches && talent.niches.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {talent.niches.slice(0, 3).map((n, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {n}
                              </Badge>
                            ))}
                            {talent.niches.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{talent.niches.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleMessageTalent(talent.username)}>
                      <Mail className="h-4 w-4 mr-2" /> Message
                    </Button>
                  </div>
                ))}
              </div>
            )
          )}
        </Card>

        {/* Trending Talents */}
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Trending Talents</CardTitle>
            <p className="text-gray-600 text-sm">Talents who recently won bounties or have high earnings.</p>
          </CardHeader>
          <div className="space-y-4">
            {trendingTalents.length > 0 ? (
              trendingTalents.map((talent) => (
                <div key={talent.uid} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={talent.profilePicUrl || "/placeholder.svg"} alt={talent.username} />
                      <AvatarFallback>{talent.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${talent.uid}`} className="font-semibold text-gray-900 hover:underline">
                        {talent.username}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {talent.bountiesWon || 0} Bounties Won • ${talent.totalEarnings || 0} Earned
                      </p>
                      {talent.niches && talent.niches.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {talent.niches.slice(0, 2).map((n, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {n}
                            </Badge>
                          ))}
                          {talent.niches.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{talent.niches.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleMessageTalent(talent.username)}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No trending talents found yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Right Column - Messages & Quick Actions */}
      <div className="lg:col-span-1 space-y-8">
        {/* In-App Wallet */}
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Your In-App Wallet</CardTitle>
          </CardHeader>
          <div className="flex items-center space-x-3">
            <Wallet className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${walletBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Available Balance</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 bg-transparent">
            Fund Wallet (Simulated)
          </Button>
        </Card>
        {/* Messages Section */}
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Your Messages</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700">{msg}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No new messages.</p>
            )}
            <Button variant="link" className="p-0 h-auto text-indigo-600 hover:underline" asChild>
              <Link href="/messages">View All Messages</Link>
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/post-bounty">
                <Briefcase className="h-5 w-5 mr-2 text-gray-600" /> Post New Bounty
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/manage-bounties">
                <Trophy className="h-5 w-5 mr-2 text-gray-600" /> Manage My Bounties
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" asChild>
              <Link href="/organization-profile">
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>O</AvatarFallback>
                </Avatar>{" "}
                My Organization Profile
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
