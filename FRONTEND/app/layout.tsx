import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'

const pixelFont = VT323({ 
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Walrus - Robust Storage',
  description: 'Secure, efficient, and decentralized.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        <div className="min-h-screen bg-[#0a0b14] text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-background" />
          <Navigation />
          <main className="relative">{children}</main>
        </div>
      </body>
    </html>
  )
}

