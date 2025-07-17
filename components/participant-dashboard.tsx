"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { WelcomeCard } from "@/components/welcome-card"
import { BountyList } from "@/components/bounty-list"
import { RecentEarnersSidebar } from "@/components/recent-earners-sidebar"
import { CircleDollarSign, Briefcase, Sparkles } from "lucide-react" // Import Sparkles icon
import { Card } from "@/components/ui/card" // Import Card components

export function ParticipantDashboard() {
  const [user, loadingAuth] = useAuthState(auth)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [bountiesParticipated, setBountiesParticipated] = useState(0)
  const [sparksBalance, setSparksBalance] = useState(0) // New state for sparks balance

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setTotalEarnings(userData.totalEarnings || 0)
          setBountiesParticipated(userData.bountiesParticipated || 0)
          setSparksBalance(userData.sparksBalance || 0) // Fetch sparks balance
        }
      }
      fetchUserData()
    }
  }, [user])

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        <WelcomeCard />

        {/* Total Earnings, Bounties Participated & Sparks Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3 shadow-sm">
            <CircleDollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </Card>
          <Card className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3 shadow-sm">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{bountiesParticipated}</p>
              <p className="text-sm text-gray-600">Bounties Participated</p>
            </div>
          </Card>
          <Card className="bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-3 shadow-sm">
            <Sparkles className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{sparksBalance.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Sparks Balance</p>
            </div>
          </Card>
        </div>

        <BountyList />
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 space-y-8">
        <RecentEarnersSidebar />
      </div>
    </div>
  )
}
