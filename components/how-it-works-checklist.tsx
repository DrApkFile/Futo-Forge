import { CheckCircle, Zap, Banknote } from "lucide-react"

export function HowItWorksChecklist() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">HOW IT WORKS</h3>
      <ul className="space-y-4">
        <li className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Create your Profile</p>
            <p className="text-sm text-gray-600">by telling us about yourself</p>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Participate in Bounties & Projects</p>
            <p className="text-sm text-gray-600">to build proof of work</p>
          </div>
        </li>
        <li className="flex items-start space-x-3">
          <Banknote className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-gray-900">Get Paid for Your Work</p>
            <p className="text-sm text-gray-600">in global standards</p>
          </div>
        </li>
      </ul>
    </div>
  )
}
