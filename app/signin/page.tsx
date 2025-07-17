"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore" // Import getDoc
import { auth, db } from "@/lib/firebase" // Import db
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("") // Can be email or username
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    let emailToSignIn = identifier

    try {
      // Check if the identifier is an email or a username
      if (!identifier.includes("@")) {
        // If it's not an email, assume it's a username and try to find the corresponding email
        // WARNING: This client-side lookup requires permissive Firestore rules (e.g., allow read: if true;)
        // on the 'users' collection, which is a SECURITY RISK in production.
        // For production, this should be handled by a secure backend (e.g., Next.js API route/Server Action)
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", identifier))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setError("No account found with that username.")
          setLoading(false)
          return
        }

        // Assuming usernames are unique, get the email from the first result
        emailToSignIn = querySnapshot.docs[0].data().email
        if (!emailToSignIn) {
          setError("Could not retrieve email for the provided username.")
          setLoading(false)
          return
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, password)
      const user = userCredential.user

      // Update lastSignIn or other fields in Firestore on email sign-in
      await setDoc(
        doc(db, "users", user.uid),
        {
          lastSignIn: new Date(),
        },
        { merge: true }, // Use merge: true to update existing document without overwriting
      )

      // Fetch user type after successful sign-in
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.userType === "organization") {
          router.push("/dashboard") // Redirect to organization dashboard
        } else {
          router.push("/dashboard") // Redirect to participant dashboard
        }
      } else {
        // If user doc doesn't exist, it's an unexpected state, redirect to default
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Save user info to Firestore (merge: true ensures it creates if not exists, updates if it does)
      await setDoc(
        doc(db, "users", user.uid),
        {
          username: user.displayName, // Use Google display name as username
          email: user.email,
          lastSignIn: new Date(),
        },
        { merge: true },
      )

      // Fetch user type after successful sign-in
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.userType === "organization") {
          router.push("/dashboard") // Redirect to organization dashboard
        } else {
          router.push("/dashboard") // Redirect to participant dashboard
        }
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Button
        variant="ghost"
        className="absolute left-4 top-4 flex items-center text-gray-600 hover:text-gray-900"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In to FutoForge</CardTitle>
          <CardDescription>Welcome back! Sign in to continue earning campus rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                type="text" // Changed to text to allow username input
                placeholder="m.aliyu@futo.edu.ng or futostudent"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} disabled={loading}>
            <FcGoogle className="mr-2 h-4 w-4" /> Sign In with Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign Up
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Signing up as an organization?{" "}
            <Link href="/organization-signup" className="underline underline-offset-4 hover:text-primary">
              Sign Up Here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
