"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore" // Import Firestore functions
import { auth, db } from "@/lib/firebase" // Import db
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update Firebase Auth profile with username
      await updateProfile(user, { displayName: username })

      // Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        userType: "participant", // Explicitly set user type
        username: username,
        email: user.email,
        createdAt: new Date(),
      })

      router.push("/bio-setup") // Redirect to bio setup page after successful signup
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
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
          userType: "participant", // Explicitly set user type
          username: user.displayName,
          email: user.email,
          lastSignIn: new Date(),
        },
        { merge: true },
      )

      router.push("/bio-setup") // Redirect to bio setup page after successful signup
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign Up for FutoForge</CardTitle>
          <CardDescription>Create your account to start earning campus rewards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="futostudent"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.aliyu@futo.edu.ng"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
              {loading ? "Signing Up..." : "Sign Up with Email"}
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
          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignUp} disabled={loading}>
            <FcGoogle className="mr-2 h-4 w-4" /> Sign Up with Google
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
              Sign In
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
