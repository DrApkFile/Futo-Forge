"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  const [username, setUsername] = React.useState("User")
  const [profilePicUrl, setProfilePicUrl] = React.useState<string | null>(null)
  const [userType, setUserType] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          setUsername(userData.username || userData.organizationName || "User")
          setProfilePicUrl(userData.profilePicUrl || null)
          setUserType(userData.userType || null)
        }
      }
    }
    fetchUserData()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/signin")
    } catch (error) {
      console.error("Error signing out:", error)
      alert("Failed to log out. Please try again.")
    }
  }

  const navLinks =
    userType === "organization"
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/post-bounty", label: "Post Bounty" },
          { href: "/manage-bounties", label: "Manage Bounties" },
          { href: "/leaderboard", label: "Talent" }, // Link to leaderboard
          { href: "/messages", label: "Messages" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/bounties", label: "Bounties" }, // Assuming a bounties listing page for participants
          { href: "/leaderboard", label: "Leaderboard" },
          { href: "/messages", label: "Messages" },
        ]

  return (
    <div className="flex h-16 items-center justify-between px-4 border-b bg-white">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/futoforge-logo.png" alt="Futoforge Logo" className="h-8" />
        <span className="text-lg font-bold">Futoforge</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), {
                    "bg-accent text-accent-foreground": pathname === link.href,
                  })}
                >
                  {link.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profilePicUrl || "/placeholder.svg"} alt={username} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/edit-profile">Edit Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
