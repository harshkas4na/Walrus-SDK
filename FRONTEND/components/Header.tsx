import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">Walrus</span>
              <img
                className="h-10 w-auto"
                src="/placeholder.svg?height=40&width=40"
                alt="Walrus logo"
              />
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link href="/explore" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Explore
              </Link>
              <Link href="/upload" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Upload
              </Link>
              <Link href="/dashboard" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Button variant="outline">Sign in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

