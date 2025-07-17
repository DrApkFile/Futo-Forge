import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Left Pane - Chat List Skeleton */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r rounded-none md:rounded-l-xl flex flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane - Chat Window Skeleton */}
      <div className="flex-1 flex flex-col rounded-none md:rounded-r-xl hidden md:flex">
        <div className="border-b p-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-start">
            <Skeleton className="h-12 w-2/3 rounded-lg" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-1/2 rounded-lg" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
          </div>
        </div>
        <div className="border-t p-4 flex items-center space-x-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}
