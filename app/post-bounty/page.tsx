"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, DollarSign, Banknote, Info, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addMonths, isAfter } from "date-fns"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Badge from "@/components/ui/badge"

export default function PostBountyPage() {
  const [user, loadingAuth] = useAuthState(auth)
  const router = useRouter()

  const [bountyBannerFile, setBountyBannerFile] = useState<File | null>(null)
  const [bountyBannerPreview, setBountyBannerPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState(0)
  const [currency, setCurrency] = useState("USD") // Default to USD
  const [maxSubmissions, setMaxSubmissions] = useState(1)
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [prizeSplits, setPrizeSplits] = useState([{ amount: 0, currency: "USD", percentage: 100 }])
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState("")

  // Sparks calculation states
  const [sparksCost, setSparksCost] = useState(0)
  const [isFormComplete, setIsFormComplete] = useState(false)

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/signin")
      return
    }
    if (user) {
      const fetchOrgData = async () => {
        const userDocRef = doc(db, "users", user.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          if (userData.userType !== "organization") {
            router.push("/dashboard") // Redirect if not an organization
            return
          }
          setOrganizationName(userData.organizationName || "Your Organization")
        } else {
          router.push("/bio-setup") // Redirect if user doc not found (shouldn't happen after signup flow)
        }
      }
      fetchOrgData()
    }
  }, [user, loadingAuth, router])

  useEffect(() => {
    // Calculate sparks cost based on bounty details
    const calculateSparks = () => {
      let cost = 0
      // Base cost for posting a bounty/project
      cost += 100 // Example base cost

      // Cost based on budget (e.g., 1% of budget)
      cost += Math.floor(budget * 0.01)

      // Cost based on max submissions (e.g., 5 sparks per submission slot)
      cost += maxSubmissions * 5

      // Cost based on number of skills (e.g., 10 sparks per skill)
      cost += skills.length * 10

      // Cost based on prize splits (e.g., 20 sparks per split beyond the first)
      cost += (prizeSplits.length - 1) * 20

      return cost
    }

    setSparksCost(calculateSparks())

    // Check form completion for conditional visibility
    const complete =
      title.trim() !== "" &&
      description.trim() !== "" &&
      budget > 0 &&
      maxSubmissions > 0 &&
      dueDate !== undefined &&
      skills.length > 0 &&
      termsAccepted
    setIsFormComplete(complete)
  }, [title, description, budget, maxSubmissions, dueDate, skills, prizeSplits, termsAccepted])

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBountyBannerFile(file)
      setBountyBannerPreview(URL.createObjectURL(file))
    } else {
      setBountyBannerFile(null)
      setBountyBannerPreview(null)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
  }

  const handleAddPrizeSplit = () => {
    setPrizeSplits([...prizeSplits, { amount: 0, currency: "USD", percentage: 0 }])
  }

  const handlePrizeSplitChange = (index: number, field: string, value: any) => {
    const newSplits = [...prizeSplits]
    newSplits[index] = { ...newSplits[index], [field]: value }

    // Recalculate percentages if amount changes
    if (field === "amount") {
      const totalAmount = newSplits.reduce((sum, split) => sum + split.amount, 0)
      newSplits.forEach((split) => {
        split.percentage = totalAmount > 0 ? Math.round((split.amount / totalAmount) * 100) : 0
      })
    } else if (field === "percentage") {
      // If percentage is manually changed, distribute remaining budget
      const totalPercentage = newSplits.reduce((sum, split) => sum + split.percentage, 0)
      if (totalPercentage > 100) {
        newSplits[index].percentage = 100 - (totalPercentage - value) // Cap at 100
      }
      // This is a simplified approach. For complex percentage distribution,
      // you'd need a more sophisticated algorithm.
    }
    setPrizeSplits(newSplits)
  }

  const handleRemovePrizeSplit = (index: number) => {
    const newSplits = prizeSplits.filter((_, i) => i !== index)
    // Recalculate percentages for remaining splits
    const totalAmount = newSplits.reduce((sum, split) => sum + split.amount, 0)
    newSplits.forEach((split) => {
      split.percentage = totalAmount > 0 ? Math.round((split.amount / totalAmount) * 100) : 0
    })
    setPrizeSplits(newSplits)
  }

  const handleSubmitBounty = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!user) {
      setError("User not authenticated.")
      setLoading(false)
      return
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions.")
      setLoading(false)
      return
    }

    if (budget <= 0) {
      setError("Bounty budget must be greater than 0.")
      setLoading(false)
      return
    }

    if (maxSubmissions <= 0) {
      setError("Maximum submissions must be at least 1.")
      setLoading(false)
      return
    }

    if (!dueDate) {
      setError("Please select a due date.")
      setLoading(false)
      return
    }

    if (skills.length === 0) {
      setError("Please add at least one required skill.")
      setLoading(false)
      return
    }

    // Determine bounty type (Bounty or Project)
    const twoMonthsFromNow = addMonths(new Date(), 2)
    const bountyType = isAfter(dueDate, twoMonthsFromNow) ? "Project" : "Bounty"

    try {
      await addDoc(collection(db, "bounties"), {
        organizationId: user.uid,
        organizationName: organizationName,
        title,
        description,
        budget,
        currency,
        maxSubmissions,
        dueDate: dueDate.toISOString(),
        skills,
        prizeSplits,
        sparksCost,
        status: "open", // Initial status
        type: bountyType, // "Bounty" or "Project"
        createdAt: serverTimestamp(),
      })

      setSuccess("Bounty posted successfully!")
      // Clear form
      setTitle("")
      setDescription("")
      setBudget(0)
      setCurrency("USD")
      setMaxSubmissions(1)
      setDueDate(new Date())
      setSkills([])
      setNewSkill("")
      setPrizeSplits([{ amount: 0, currency: "USD", percentage: 100 }])
      setTermsAccepted(false)
    } catch (err: any) {
      console.error("Error posting bounty:", err)
      setError(err.message)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Post a New Bounty</CardTitle>
            <CardDescription>Fill in the details to create your bounty or project.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitBounty} className="space-y-6">
              {/* Bounty Banner */}
              <div className="space-y-2">
                <Label htmlFor="bounty-banner">Bounty Banner (Optional)</Label>
                <div className="flex flex-col items-center space-y-4">
                  {bountyBannerPreview && (
                    <img
                      src={bountyBannerPreview || "/placeholder.svg"}
                      alt="Bounty Banner Preview"
                      className="w-full h-48 object-cover rounded-md border border-gray-200"
                    />
                  )}
                  <Label htmlFor="bounty-banner" className="cursor-pointer">
                    <Button asChild variant="outline">
                      <span>Choose Banner Image</span>
                    </Button>
                    <Input
                      id="bounty-banner"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerFileChange}
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Bounty Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Design a new landing page"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the task, deliverables, and expectations."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <div className="flex items-center space-x-2">
                    <Select value={currency} onValueChange={setCurrency}>
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
                        {/* Add more crypto options if needed */}
                        <SelectItem value="ETH">
                          <div className="flex items-center">
                            <img src="/ethereum-logo.svg" alt="ETH" className="h-4 w-4 mr-1" /> ETH
                          </div>
                        </SelectItem>
                        <SelectItem value="BTC">
                          <div className="flex items-center">
                            <img src="/bitcoin-logo.svg" alt="BTC" className="h-4 w-4 mr-1" /> BTC
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="1000"
                      value={budget === 0 ? "" : budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSubmissions">Max Submissions</Label>
                  <Input
                    id="maxSubmissions"
                    type="number"
                    placeholder="1"
                    value={maxSubmissions}
                    onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      fromDate={new Date()} // Calendar starts from today
                    />
                  </PopoverContent>
                </Popover>
                {dueDate && isAfter(dueDate, addMonths(new Date(), 2)) && (
                  <Alert className="mt-2">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      This bounty will be categorized as a "Project" due to its extended timeline (more than 2 months).
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0.5 rounded-full hover:bg-gray-200"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="newSkill"
                    type="text"
                    placeholder="Add a skill (e.g., 'React', 'Content Writing')"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddSkill()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Prize Splits</Label>
                {prizeSplits.map((split, index) => (
                  <div key={index} className="flex items-end gap-2 border p-3 rounded-md bg-gray-50">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`split-amount-${index}`}>Amount</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={split.currency}
                          onValueChange={(value) => handlePrizeSplitChange(index, "currency", value)}
                        >
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
                            <SelectItem value="ETH">
                              <div className="flex items-center">
                                <img src="/ethereum-logo.svg" alt="ETH" className="h-4 w-4 mr-1" /> ETH
                              </div>
                            </SelectItem>
                            <SelectItem value="BTC">
                              <div className="flex items-center">
                                <img src="/bitcoin-logo.svg" alt="BTC" className="h-4 w-4 mr-1" /> BTC
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id={`split-amount-${index}`}
                          type="number"
                          placeholder="0"
                          value={split.amount === 0 ? "" : split.amount}
                          onChange={(e) => handlePrizeSplitChange(index, "amount", Number(e.target.value))}
                          min={0}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`split-percentage-${index}`}>Percentage</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id={`split-percentage-${index}`}
                          min={0}
                          max={100}
                          step={1}
                          value={[split.percentage]}
                          onValueChange={(val) => handlePrizeSplitChange(index, "percentage", val[0])}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={split.percentage}
                          onChange={(e) => handlePrizeSplitChange(index, "percentage", Number(e.target.value))}
                          className="w-16 text-center"
                          min={0}
                          max={100}
                        />
                        <span>%</span>
                      </div>
                    </div>
                    {prizeSplits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePrizeSplit(index)}
                        className="self-center"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove split</span>
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddPrizeSplit} className="w-full bg-transparent">
                  Add Prize Split
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="underline">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              {isFormComplete && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Estimated Sparks Cost:</span>
                    <span>{sparksCost} Sparks</span>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Posting Bounty..." : `Post Bounty & Pay ${sparksCost} Sparks`}
                  </Button>
                </div>
              )}
              {!isFormComplete && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Complete the form</AlertTitle>
                  <AlertDescription>
                    Fill in all required fields to see the estimated sparks cost and enable the post button.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
