import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="mb-6 text-gray-600">
            We collect information you provide directly to us, such as when you create an account, complete tasks, or
            contact us for support. This may include your name, email address, university information, and payment
            details.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="mb-6 text-gray-600">
            We use the information we collect to provide, maintain, and improve our services, process transactions,
            communicate with you, and ensure platform security.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="mb-6 text-gray-600">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent, except as described in this policy or as required by law.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
          <p className="mb-6 text-gray-600">
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="mb-6 text-gray-600">
            You have the right to access, update, or delete your personal information. You may also opt out of certain
            communications from us.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
          <p className="mb-6 text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at privacy@futoforge.com.
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
