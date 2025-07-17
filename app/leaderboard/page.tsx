"use client"

import { Button } from "@/components/ui/button"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"

interface LeaderboardTalent {
  uid: string
  username: string
  profilePicUrl?: string
  winRate: number // Simulated
  bountyWins: number // Simulated
  totalSubmissions: number // Simulated
  niches: string[]
  totalEarnings: number // For sorting
}

export default function LeaderboardPage() {
  const [user] = useAuthState(auth)
  const [filterCategory, setFilterCategory] = useState("all") // all, content, design, development
  const [filterTime, setFilterTime] = useState("all-time") // all-time, this-year, this-month, this-week
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardTalent[]>([])
  const [userRanking, setUserRanking] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulated data for leaderboard
  const allTalents: LeaderboardTalent[] = [
    {
      uid: "user1",
      username: "AliceDev",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 85,
      bountyWins: 15,
      totalSubmissions: 20,
      niches: ["Web Development", "React", "Node.js"],
      totalEarnings: 15000,
    },
    {
      uid: "user2",
      username: "BobDesigner",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 90,
      bountyWins: 12,
      totalSubmissions: 18,
      niches: ["UI/UX Design", "Figma", "Branding"],
      totalEarnings: 12000,
    },
    {
      uid: "user3",
      username: "CharlieWriter",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 75,
      bountyWins: 10,
      totalSubmissions: 25,
      niches: ["Content Writing", "SEO", "Copywriting"],
      totalEarnings: 10000,
    },
    {
      uid: "user4",
      username: "DianaCoder",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 80,
      bountyWins: 11,
      totalSubmissions: 19,
      niches: ["Mobile Development", "Flutter", "Dart"],
      totalEarnings: 11000,
    },
    {
      uid: "user5",
      username: "EveArtist",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 92,
      bountyWins: 9,
      totalSubmissions: 10,
      niches: ["Graphic Design", "Illustration"],
      totalEarnings: 9500,
    },
    {
      uid: "user6",
      username: "FrankMarketer",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 65,
      bountyWins: 8,
      totalSubmissions: 30,
      niches: ["Digital Marketing", "Social Media"],
      totalEarnings: 8000,
    },
    {
      uid: "user7",
      username: "GraceAnalyst",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 70,
      bountyWins: 7,
      totalSubmissions: 22,
      niches: ["Data Analysis", "Python", "SQL"],
      totalEarnings: 7500,
    },
    {
      uid: "user8",
      username: "HenryPhotog",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 88,
      bountyWins: 6,
      totalSubmissions: 15,
      niches: ["Photography", "Editing"],
      totalEarnings: 6000,
    },
    {
      uid: "user9",
      username: "IvyArchitect",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 78,
      bountyWins: 5,
      totalSubmissions: 12,
      niches: ["Architecture", "3D Modeling"],
      totalEarnings: 5500,
    },
    {
      uid: "user10",
      username: "JackGameDev",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 82,
      bountyWins: 4,
      totalSubmissions: 10,
      niches: ["Game Development", "Unity"],
      totalEarnings: 5000,
    },
    {
      uid: "user11",
      username: "KarenUX",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 87,
      bountyWins: 10,
      totalSubmissions: 15,
      niches: ["UI/UX Design", "Wireframing"],
      totalEarnings: 10500,
    },
    {
      uid: "user12",
      username: "LiamBackend",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 79,
      bountyWins: 13,
      totalSubmissions: 21,
      niches: ["Backend Development", "Python", "Django"],
      totalEarnings: 13000,
    },
    {
      uid: "user13",
      username: "MiaContent",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 72,
      bountyWins: 9,
      totalSubmissions: 28,
      niches: ["Content Writing", "Blog Posts"],
      totalEarnings: 9000,
    },
    {
      uid: "user14",
      username: "NoahFrontend",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 81,
      bountyWins: 14,
      totalSubmissions: 23,
      niches: ["Frontend Development", "Vue.js"],
      totalEarnings: 14500,
    },
    {
      uid: "user15",
      username: "OliviaIllustrator",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 91,
      bountyWins: 8,
      totalSubmissions: 11,
      niches: ["Illustration", "Digital Art"],
      totalEarnings: 8500,
    },
    {
      uid: "user16",
      username: "PeterSEO",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 68,
      bountyWins: 7,
      totalSubmissions: 32,
      niches: ["SEO", "Keyword Research"],
      totalEarnings: 7000,
    },
    {
      uid: "user17",
      username: "QuinnData",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 73,
      bountyWins: 6,
      totalSubmissions: 24,
      niches: ["Data Science", "Machine Learning"],
      totalEarnings: 6500,
    },
    {
      uid: "user18",
      username: "RachelVideo",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 89,
      bountyWins: 5,
      totalSubmissions: 16,
      niches: ["Video Editing", "Motion Graphics"],
      totalEarnings: 5800,
    },
    {
      uid: "user19",
      username: "Sam3D",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 76,
      bountyWins: 4,
      totalSubmissions: 13,
      niches: ["3D Design", "Blender"],
      totalEarnings: 5200,
    },
    {
      uid: "user20",
      username: "TinaMobile",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 83,
      bountyWins: 3,
      totalSubmissions: 9,
      niches: ["Mobile App Dev", "Swift"],
      totalEarnings: 4800,
    },
    {
      uid: "user21",
      username: "UmaWeb",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 84,
      bountyWins: 16,
      totalSubmissions: 21,
      niches: ["Web Development", "Angular"],
      totalEarnings: 16000,
    },
    {
      uid: "user22",
      username: "VictorProduct",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 86,
      bountyWins: 11,
      totalSubmissions: 17,
      niches: ["Product Design", "Sketch"],
      totalEarnings: 11500,
    },
    {
      uid: "user23",
      username: "WendyCopy",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 70,
      bountyWins: 10,
      totalSubmissions: 26,
      niches: ["Copywriting", "Marketing"],
      totalEarnings: 9800,
    },
    {
      uid: "user24",
      username: "XavierFullstack",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 88,
      bountyWins: 14,
      totalSubmissions: 20,
      niches: ["Fullstack Development", "Next.js"],
      totalEarnings: 14000,
    },
    {
      uid: "user25",
      username: "YaraBrand",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 93,
      bountyWins: 9,
      totalSubmissions: 10,
      niches: ["Brand Identity", "Logo Design"],
      totalEarnings: 9200,
    },
    {
      uid: "user26",
      username: "ZoeSocial",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 67,
      bountyWins: 8,
      totalSubmissions: 31,
      niches: ["Social Media Mgmt", "Content Strategy"],
      totalEarnings: 7800,
    },
    {
      uid: "user27",
      username: "AdamAI",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 71,
      bountyWins: 7,
      totalSubmissions: 23,
      niches: ["AI/ML", "Deep Learning"],
      totalEarnings: 7200,
    },
    {
      uid: "user28",
      username: "BellaAnimator",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 90,
      bountyWins: 6,
      totalSubmissions: 14,
      niches: ["Animation", "After Effects"],
      totalEarnings: 6200,
    },
    {
      uid: "user29",
      username: "CalebVR",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 77,
      bountyWins: 5,
      totalSubmissions: 11,
      niches: ["VR Development", "Unity"],
      totalEarnings: 5300,
    },
    {
      uid: "user30",
      username: "DanaBlockchain",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 85,
      bountyWins: 4,
      totalSubmissions: 9,
      niches: ["Blockchain", "Solidity"],
      totalEarnings: 4900,
    },
    {
      uid: "user31",
      username: "EthanCloud",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 80,
      bountyWins: 12,
      totalSubmissions: 18,
      niches: ["Cloud Computing", "AWS"],
      totalEarnings: 12500,
    },
    {
      uid: "user32",
      username: "FionaGameArt",
      profilePicUrl: "/placeholder.svg?height=40&width=40",
      winRate: 94,
      bountyWins: 10,
      totalSubmissions: 12,
      niches: ["Game Art", "Concept Art"],
      totalEarnings: 10800,
    },
  ].sort((a, b) => b.totalEarnings - a.totalEarnings) // Sort by earnings for initial display

  useEffect(() => {
    setLoading(true)
    let filtered = allTalents

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter((talent) =>
        talent.niches.some(
          (niche) =>
            niche.toLowerCase().includes(filterCategory) ||
            (filterCategory === "development" &&
              (niche.toLowerCase().includes("dev") || niche.toLowerCase().includes("code"))) ||
            (filterCategory === "design" &&
              (niche.toLowerCase().includes("design") || niche.toLowerCase().includes("art"))) ||
            (filterCategory === "content" &&
              (niche.toLowerCase().includes("content") || niche.toLowerCase().includes("writing"))),
        ),
      )
    }

    // Simulate time filtering (for a real app, you'd filter by timestamp)
    if (filterTime === "this-year") {
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.8))
    } else if (filterTime === "this-month") {
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.6))
    } else if (filterTime === "this-week") {
      filtered = filtered.slice(0, Math.floor(filtered.length * 0.4))
    }

    setLeaderboardData(filtered.slice(0, 30)) // Show top 30 initially

    // Simulate user's ranking
    if (user) {
      const currentUserIndex = allTalents.findIndex((t) => t.uid === user.uid)
      if (currentUserIndex !== -1) {
        setUserRanking(currentUserIndex + 1)
      } else {
        setUserRanking(null) // User not in top earners
      }
    } else {
      setUserRanking(null)
    }

    setLoading(false)
  }, [filterCategory, filterTime, user])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">Talent Leaderboard</CardTitle>
            <p className="text-gray-600">Discover the top earners and performers on Futoforge.</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <Tabs value={filterCategory} onValueChange={setFilterCategory} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-4 h-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="development">Development</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={filterTime} onValueChange={setFilterTime}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user && userRanking !== null && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <p className="text-indigo-800 font-semibold">
                  Your Rank: <span className="text-xl font-bold">#{userRanking}</span>
                </p>
                <Link href={`/profile/${user.uid}`} className="text-indigo-600 hover:underline text-sm">
                  View My Profile
                </Link>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : leaderboardData.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No talents found for the selected filters.</p>
            ) : (
              <div className="space-y-4">
                {leaderboardData.map((talent, index) => (
                  <div
                    key={talent.uid}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-700 w-8 text-center">#{index + 1}</span>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={talent.profilePicUrl || "/placeholder.svg"} alt={talent.username} />
                        <AvatarFallback>{talent.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/profile/${talent.uid}`} className="font-semibold text-gray-900 hover:underline">
                          {talent.username}
                        </Link>
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
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-700">
                      <div className="text-center">
                        <p className="font-bold">{talent.winRate}%</p>
                        <p>Win Rate</p>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div className="text-center">
                        <p className="font-bold">{talent.bountyWins}</p>
                        <p>Bounty Wins</p>
                      </div>
                      <Separator orientation="vertical" className="h-8" />
                      <div className="text-center">
                        <p className="font-bold">{talent.totalSubmissions}</p>
                        <p>Submissions</p>
                      </div>
                    </div>
                  </div>
                ))}
                {allTalents.length > 30 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">Load More (Simulated)</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
