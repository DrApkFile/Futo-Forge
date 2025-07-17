import {
  ArrowRight,
  Search,
  Upload,
  Coins,
  Users,
  Shield,
  Wallet,
  Mail,
  Twitter,
  MessageCircle,
  Phone,
  Zap,
  MessageSquare,
  CheckCircle,
  CircleDollarSign,
  Banknote,
  Briefcase,
  Menu,
} from "lucide-react"
import Link from "next/link" // Import Link for navigation
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/futoforge-logo.png" alt="FutoForge" className="h-8 w-auto mr-2" />
              <h1 className="text-2xl font-bold text-blue-900">FutoForge</h1>
            </div>
            <div className="flex items-center md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 pt-6">
                    <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900 text-lg font-medium">
                      How It Works
                    </Link>
                    <Link href="#features" className="text-gray-700 hover:text-gray-900 text-lg font-medium">
                      Features
                    </Link>
                    <Link
                      href="/signup"
                      className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/organization-signup"
                      className="text-purple-600 border border-purple-600 px-4 py-2 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      Sign Up as Organization
                    </Link>
                    <Link
                      href="/signin"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </a>
                <Link
                  href="/signup"
                  className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors mr-2"
                >
                  Sign Up
                </Link>
                <Link
                  href="/organization-signup"
                  className="text-purple-600 border border-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors mr-2"
                >
                  Sign Up as Organization
                </Link>
                <Link
                  href="/signin"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Turn your skills into</span>
              <span className="block text-indigo-600">campus rewards</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete real-world tasks posted by campus groups, startups, and faculty. Earn crypto, cash, and build
              your reputation while contributing to your university community.
            </p>
            <div className="flex justify-center">
              <Link
                href="/signin" // Link to sign-in page
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Explore Bounties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Superteam Style Layout */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content - Bounties */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Bounties</h2>
                <p className="text-gray-600">Start earning with these trending opportunities</p>
              </div>

              <div className="space-y-4">
                {/* Bounty 1: Design */}
                <Link href="/signin" className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="FUTO Student Union Logo"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">Create FUTO Student Union Logo</h3>
                        <p className="text-gray-600 text-sm flex items-center space-x-2">
                          <span>FUTO Student Union</span>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        </p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-gray-400" /> Bounty
                          </span>
                          <span>Due in 5d</span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-gray-400" /> 12
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-gray-900 flex items-center">
                        <Banknote className="w-5 h-5 mr-1 text-green-600" />
                        25,000 <span className="text-sm ml-1 text-gray-600">NGN</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bounty 2: Development */}
                <Link href="/signin" className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Computer Science Dept Logo"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">Build Course Registration System</h3>
                        <p className="text-gray-600 text-sm flex items-center space-x-2">
                          <span>Computer Science Dept</span>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        </p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-gray-400" /> Bounty
                          </span>
                          <span>Due in 12d</span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-gray-400" /> 8
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-gray-900 flex items-center">
                        <CircleDollarSign className="w-5 h-5 mr-1 text-green-600" />
                        750 <span className="text-sm ml-1 text-gray-600">USDC</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bounty 3: Content */}
                <Link href="/signin" className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="FUTO Media Club Logo"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">Write Campus Event Coverage</h3>
                        <p className="text-gray-600 text-sm flex items-center space-x-2">
                          <span>FUTO Media Club</span>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        </p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-gray-400" /> Bounty
                          </span>
                          <span>Due in 7d</span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-gray-400" /> 15
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-gray-900 flex items-center">
                        <CircleDollarSign className="w-5 h-5 mr-1 text-green-600" />
                        150 <span className="text-sm ml-1 text-gray-600">USDC</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bounty 4: Research */}
                <Link href="/signin" className="block">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src="/placeholder.svg?height=48&width=48"
                        alt="Statistics Dept Logo"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">Data Analysis for Research Project</h3>
                        <p className="text-gray-600 text-sm flex items-center space-x-2">
                          <span>Statistics Dept</span>
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        </p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1 text-gray-400" /> Project
                          </span>
                          <span>Due in 10d</span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-gray-400" /> 6
                          </span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-xl font-bold text-gray-900 flex items-center">
                        <CircleDollarSign className="w-5 h-5 mr-1 text-green-600" />
                        400 <span className="text-sm ml-1 text-gray-600">USDC</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/signin"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  View All Bounties
                </Link>
              </div>
            </div>

            {/* Sidebar - Recent Earners */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Earners</h3>
                  <Link
                    href="/signin"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                  >
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
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these three steps to start earning on campus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Browse Tasks</h3>
              <p className="text-gray-600">
                Discover bounties posted by student clubs, faculty, and campus startups. Filter by skills, rewards, and
                deadlines to find the perfect match.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Submit Your Work</h3>
              <p className="text-gray-600">
                Complete the task and submit your deliverables. Upload files, share links, or provide any required
                documentation for review.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Earn Rewards</h3>
              <p className="text-gray-600">
                Get paid in crypto, cash, or campus perks. Build your reputation and unlock access to higher-value
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose FutoForge?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for university students, by students who understand your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn While You Learn</h3>
              <p className="text-gray-600">
                Apply your classroom knowledge to real-world projects. Gain practical experience while earning money for
                your skills.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Students, By Students</h3>
              <p className="text-gray-600">
                A trusted platform built for the FUTO community. Connect with fellow students, faculty, and campus
                organizations through meaningful work opportunities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
              <div className="bg-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid securely through multiple payment methods. Earn in cash or crypto based on task requirements
                and your preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students already earning rewards for their skills. Connect your wallet or sign in with
            your university email to get started.
          </p>

          <div className="flex justify-center">
            <Link
              href="/signup" // Link to sign-up page
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/futoforge-logo.png" alt="FutoForge" className="h-8 w-auto mr-2" />
                <h3 className="text-2xl font-bold text-white">FutoForge</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering FUTO students to monetize their skills through real-world tasks and bounties within their
                campus community.
              </p>
              <div className="inline-flex items-center bg-white rounded-lg px-3 py-2">
                <div className="flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-sm mr-1"></div>
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-sm mr-2"></div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-lakha">POWERED BY</div>
                    <div className="text-sm font-bold text-gray-900 font-lakha">LAKHA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-6 w-6" />
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                <a href="mailto:hello@futoforge.com" className="hover:text-white transition-colors">
                  hello@futoforge.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} FutoForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
