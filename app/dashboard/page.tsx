"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { DashboardNav } from "@/components/dashboard-nav"
import { ParticipantDashboard } from "@/components/participant-dashboard"
import { OrganizationDashboard } from "@/components/organization-dashboard"

export default function DashboardPage() {
  const [user, loadingAuth] = useAuthState(auth)
  const [userType, setUserType] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin")
    } else if (user) {
      const fetchUserType = async () => {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          setUserType(userDocSnap.data().userType || "participant") // Default to participant
        } else {
          // If user doc doesn't exist, it's an unexpected state, redirect to bio-setup
          router.push("/bio-setup")
        }
      }
      fetchUserType()
    }
  }, [user, loadingAuth, router])

  // Show loading state while authentication or user type is being determined
  if (loadingAuth || userType === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userType === "participant" ? <ParticipantDashboard /> : <OrganizationDashboard />}
      </main>
    </div>
  )
}
