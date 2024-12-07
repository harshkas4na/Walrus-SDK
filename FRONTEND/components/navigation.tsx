import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="relative z-10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#4fd1c5] pixel-text">Datalink.Ai</Link>
        <ul className="flex space-x-4">
          <li><Link href="/about" className="text-white hover:text-[#4fd1c5]">About</Link></li>
          <li><Link href="/upload" className="text-white hover:text-[#4fd1c5]">Guide</Link></li>
        </ul>
      </div>
    </nav>
  )
}

