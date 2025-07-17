"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"

export function WelcomeCard() {
  const [user, loadingAuth] = useAuthState(auth)
  const [username, setUsername] = useState("User")
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setUsername(userData.username || user.displayName || user.email || "User")
          setProfilePicUrl(userData.profilePicUrl || user.photoURL || null)
        } else {
          setUsername(user.displayName || user.email || "User")
          setProfilePicUrl(user.photoURL || null)
        }
      }
    }
    fetchUserData()
  }, [user])

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
      <CardContent className="flex items-center space-x-4 p-0">
        <Avatar className="h-16 w-16 border-2 border-white">
          <AvatarImage src={profilePicUrl || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="bg-white text-indigo-600 text-xl font-bold">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {username}</h2>
          <p className="text-indigo-100">We're so glad to have you on FutoForge</p>
        </div>
      </CardContent>
    </Card>
  )
}
