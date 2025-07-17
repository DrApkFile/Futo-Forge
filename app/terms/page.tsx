import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsOfServicePage() {
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
                    <Link href="/about" className="text-gray-700 hover:text-gray-900 text-lg font-medium">
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
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6 text-gray-600">
            By accessing and using FutoForge, you accept and agree to be bound by the terms and provision of this
            agreement.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
          <p className="mb-6 text-gray-600">
            FutoForge is intended for use by current students, faculty, and staff of the Federal University of
            Technology Owerri (FUTO). Users must be at least 18 years old or have parental consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
          <p className="mb-6 text-gray-600">
            Users are responsible for maintaining the confidentiality of their account information, providing accurate
            information, and complying with all applicable laws and regulations.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Task Completion and Payment</h2>
          <p className="mb-6 text-gray-600">
            Task completion and payment terms are agreed upon between task posters and completers. FutoForge facilitates
            these transactions but is not responsible for disputes between parties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
          <p className="mb-6 text-gray-600">
            Users may not engage in fraudulent activities, post inappropriate content, violate intellectual property
            rights, or use the platform for any illegal purposes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Platform Availability</h2>
          <p className="mb-6 text-gray-600">
            We strive to maintain platform availability but do not guarantee uninterrupted service. We reserve the right
            to modify or discontinue services with notice.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="mb-6 text-gray-600">
            FutoForge's liability is limited to the maximum extent permitted by law. We are not liable for indirect,
            incidental, or consequential damages.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
          <p className="mb-6 text-gray-600">
            We reserve the right to modify these terms at any time. Users will be notified of significant changes, and
            continued use constitutes acceptance of modified terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
          <p className="mb-6 text-gray-600">
            For questions about these Terms of Service, please contact us at legal@futoforge.com.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/futoforge-logo.png" alt="FutoForge" className="h-8 w-auto mr-2" />
              <h3 className="text-2xl font-bold text-white">FutoForge</h3>
            </div>
            <p className="text-gray-500 text-sm">Powered by Lakha</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
