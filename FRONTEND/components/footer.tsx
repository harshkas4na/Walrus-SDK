import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#4fd1c5]/20 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl text-[#4fd1c5] mb-4">Datalink.AI</h3>
          <p className="text-white/60">Secure, efficient, and decentralized AI dataset repository.</p>
        </div>
        <div>
          <h4 className="text-lg text-[#4fd1c5] mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-white/60 hover:text-[#4fd1c5]">About</Link></li>
            <li><Link href="/upload" className="text-white/60 hover:text-[#4fd1c5]">Upload</Link></li>
            <li><Link href="/explore" className="text-white/60 hover:text-[#4fd1c5]">Explore Datasets</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg text-[#4fd1c5] mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><Link href="/docs" className="text-white/60 hover:text-[#4fd1c5]">Documentation</Link></li>
            <li><Link href="/api" className="text-white/60 hover:text-[#4fd1c5]">API</Link></li>
            <li><Link href="/blog" className="text-white/60 hover:text-[#4fd1c5]">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg text-[#4fd1c5] mb-4">Connect</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-white/60 hover:text-[#4fd1c5]">Twitter</a></li>
            <li><a href="#" className="text-white/60 hover:text-[#4fd1c5]">GitHub</a></li>
            <li><a href="#" className="text-white/60 hover:text-[#4fd1c5]">Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[#4fd1c5]/20 text-center text-white/60">
        <p>&copy; 2023 Walrus. All rights reserved.</p>
      </div>
    </footer>
  )
}

