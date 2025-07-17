import { ArrowRight, CircleDollarSign, Banknote } from "lucide-react"
import Link from "next/link"

export function RecentEarnersSidebar() {
  const recentEarners = [
    {
      name: "Chinedu Okafor",
      project: "FUTO Tech Hub | Web Development",
      amount: "45,000",
      currency: "₦",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Adaora Nwankwo",
      project: "Student Union | Logo Design",
      amount: "250",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Emeka Ugwu",
      project: "Engineering Dept | Database System",
      amount: "600",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Blessing Okoro",
      project: "FUTO Media | Content Writing",
      amount: "150",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Kelechi Eze",
      project: "Computer Science | Mobile App",
      amount: "800",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chioma Obi",
      project: "Student Affairs | UI/UX Design",
      amount: "350",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ifeanyi Nkem",
      project: "FUTO Startup | Backend API",
      amount: "550",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ngozi Agu",
      project: "Library System | Frontend",
      amount: "400",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Obinna Chukwu",
      project: "Sports Club | Brand Identity",
      amount: "200",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Amaka Okonkwo",
      project: "Research Lab | Data Analysis",
      amount: "500",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Tochukwu Ike",
      project: "FUTO Radio | Audio Production",
      amount: "300",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chiamaka Nnaji",
      project: "Student Portal | Testing",
      amount: "250",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chukwuemeka Obi",
      project: "Tech Community | DevOps",
      amount: "650",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ifeoma Okwu",
      project: "Design Club | Illustration",
      amount: "280",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Nnamdi Eze",
      project: "Startup Incubator | Full Stack",
      amount: "900",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chidinma Okafor",
      project: "Student Magazine | Editorial",
      amount: "180",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ikechukwu Nwoke",
      project: "E-learning Platform | Backend",
      amount: "700",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Onyinye Agu",
      project: "Campus Events | Social Media",
      amount: "220",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chukwudi Okonkwo",
      project: "Innovation Lab | AI Model",
      amount: "850",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Adanna Okoro",
      project: "Student Services | UX Research",
      amount: "320",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ebuka Nwankwo",
      project: "FUTO Games | Game Development",
      amount: "750",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Chinelo Eze",
      project: "Health Center | Mobile App",
      amount: "480",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Okechukwu Obi",
      project: "Library | Catalog System",
      amount: "420",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Uchenna Okwu",
      project: "Student Blog | CMS Development",
      amount: "380",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Amarachi Nkem",
      project: "Art Club | Digital Portfolio",
      amount: "260",
      currency: "USDC",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Duplicate earners for seamless vertical scrolling
  const allEarners = [...recentEarners, ...recentEarners]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">RECENT EARNERS</h3>
        <Link href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
          Leaderboard <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 animate-vertical-scroll">
          {allEarners.map((earner, index) => (
            <div key={index} className="flex items-start space-x-3 py-2">
              <img
                src={earner.avatar || "/placeholder.svg"}
                alt={earner.name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{earner.name}</p>
                <p className="text-xs text-gray-500 truncate">{earner.project}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-green-600 text-sm flex items-center">
                  {earner.currency === "₦" ? (
                    <Banknote className="w-4 h-4 mr-1 text-green-600" />
                  ) : (
                    <CircleDollarSign className="w-4 h-4 mr-1 text-green-600" />
                  )}
                  {earner.amount} <span className="ml-1 text-gray-600">{earner.currency}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
