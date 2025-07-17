import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Zap, MessageSquare, CheckCircle, CircleDollarSign, Banknote, Briefcase } from "lucide-react"
import Link from "next/link"

export function BountyList() {
  const bounties = [
    {
      id: "1",
      title: "Develop a FUTO Course Review Platform",
      organization: "FUTO Computer Science Dept.",
      amount: "750",
      currency: "USDC",
      type: "Bounty",
      dueDate: "4h",
      comments: 14,
      category: "Development",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "2",
      title: "Design a New Logo for FUTO Student Union",
      organization: "FUTO Student Union",
      amount: "250",
      currency: "USDC",
      type: "Bounty",
      dueDate: "9d",
      comments: 11,
      category: "Design",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "3",
      title: "Create a 3D Model of the FUTO Senate Building",
      organization: "FUTO Architecture Dept.",
      amount: "400-600",
      currency: "USDC",
      type: "Project",
      dueDate: "15d",
      comments: 6,
      category: "Design",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "4",
      title: "Write Articles for the FUTO Campus Blog",
      organization: "FUTO Media Club",
      amount: "150",
      currency: "USDC",
      type: "Bounty",
      dueDate: "7d",
      comments: 8,
      category: "Content",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "5",
      title: "Research on Renewable Energy Sources for Campus",
      organization: "FUTO Engineering Faculty",
      amount: "1,000",
      currency: "USDC",
      type: "Project",
      dueDate: "30d",
      comments: 20,
      category: "Other",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "6",
      title: "Develop a Mobile App for Campus Navigation",
      organization: "FUTO Innovation Hub",
      amount: "1,500",
      currency: "USDC",
      type: "Bounty",
      dueDate: "25d",
      comments: 18,
      category: "Development",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "7",
      title: "Create Social Media Content for FUTO Alumni Network",
      organization: "FUTO Alumni Association",
      amount: "200",
      currency: "USDC",
      type: "Bounty",
      dueDate: "10d",
      comments: 9,
      category: "Content",
      logo: "/placeholder.svg?height=48&width=48",
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Browse Opportunities</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search" className="pl-9 pr-3 py-2 rounded-md text-sm" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-4">
          {bounties.map((bounty) => (
            <Link href={`/bounties/${bounty.id}`} key={bounty.id} className="block">
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={bounty.logo || "/placeholder.svg"}
                    alt={`${bounty.organization} Logo`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{bounty.title}</h3>
                    <p className="text-gray-600 text-sm flex items-center space-x-2">
                      <span>{bounty.organization}</span>
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    </p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        {bounty.type === "Bounty" ? (
                          <Zap className="w-4 h-4 mr-1 text-gray-400" />
                        ) : (
                          <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                        )}{" "}
                        {bounty.type}
                      </span>
                      <span>Due in {bounty.dueDate}</span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1 text-gray-400" /> {bounty.comments}
                      </span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-xl font-bold text-gray-900 flex items-center">
                    {bounty.currency === "₦" ? (
                      <Banknote className="w-5 h-5 mr-1 text-green-600" />
                    ) : (
                      <CircleDollarSign className="w-5 h-5 mr-1 text-green-600" />
                    )}
                    {bounty.amount} <span className="text-sm ml-1 text-gray-600">{bounty.currency}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </TabsContent>
        {/* Add other TabsContent for 'for-you', 'content', 'design', 'development', 'other' if needed */}
      </Tabs>
    </div>
  )
}
