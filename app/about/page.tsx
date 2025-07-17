import Link from "next/link"
import { Users, Target, Lightbulb, Github, Twitter, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Skipp",
      role: "Founder & Lead Dev",
      bio: "Cracked 10x dev with a passion for web3 and blockchain based systems.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "DrApkFile",
      role: "CEO & FullStack Team Lead",
      bio: "Backend Maestro with an Eye for building the future.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        twitter: "#",
        github: "#",
      },
    },
    {
      name: "JackTheRipper",
      role: "CTOO & CMO",
      bio: "Student leader focused on building meaningful connections within the campus ecosystem.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        twitter: "#",
        github: "#",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img src="/futoforge-logo.png" alt="FutoForge" className="h-8 w-auto mr-2" />
                <h1 className="text-2xl font-bold text-blue-900">FutoForge</h1>
              </Link>
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
                    <Link href="/" className="text-gray-700 hover:text-gray-900 text-lg font-medium">
                      Home
                    </Link>
                    <Link href="/about" className="text-indigo-600 text-lg font-medium">
                      About
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
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  About
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
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About FutoForge</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering the Federal University of Technology Owerri community through meaningful work opportunities and
              skill development.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create a thriving ecosystem where FUTO students can apply their skills to real-world challenges while
                earning meaningful rewards and building their professional reputation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the premier platform connecting FUTO's talented student body with opportunities that bridge
                academic learning and practical application.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600">
                Community-first approach, academic excellence, innovation, transparency, and empowering students to
                reach their full potential through meaningful work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              FutoForge was born from a simple observation: FUTO is home to incredibly talented students with diverse
              skills, while campus organizations, faculty, and local startups often need help with various projects and
              tasks.
            </p>
            <p className="mb-6">
              We recognized the gap between student potential and real-world application opportunities. Traditional
              internships and part-time jobs often don't align with academic schedules or allow students to showcase
              their unique skills.
            </p>
            <p className="mb-6">
              FutoForge bridges this gap by creating a platform where students can find meaningful work that fits their
              schedule, skills, and interests. Whether it's helping a professor with research, creating content for a
              student organization, or contributing to a local startup's project, every task on FutoForge is designed to
              provide real value to both students and task posters.
            </p>
            <p>
              Our platform represents the future of campus collaboration - where skills meet opportunity, and every
              student has the chance to earn while they learn.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals building the future of campus collaboration at FUTO.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a href={member.social.twitter} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={member.social.github} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/futoforge-logo.png" alt="FutoForge" className="h-8 w-auto mr-2" />
                <h3 className="text-2xl font-bold text-white">FutoForge</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering FUTO students to monetize their skills through real-world tasks and bounties within their
                campus community.
              </p>
              <p className="text-gray-500 text-sm">Powered by Lakha</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
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

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Users className="h-6 w-6" />
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
