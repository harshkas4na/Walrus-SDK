import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LanguageSelector } from '@/components/language-selector'
import { Features } from '@/components/features'
import { Partners } from '@/components/partners'
import { LiveStats } from '@/components/live-stats'
import { Footer } from '@/components/footer'

export default function DataLink() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-32 pt-12">
        <h1 className="text-7xl md:text-9xl mb-4 leading-none tracking-tight">
          <span className="text-[#4fd1c5]">Datalink.Ai</span> 
          <br />
          <span className="text-white">Marketplace</span>
        </h1>
        <p className="text-[#4fd1c5]/60 text-xl mb-8">Empowering AI with trust, transparency, and reputation-driven excellence.</p>
        <div className="flex justify-center gap-4">
          <Button variant="retro" size="lg" asChild>
            <Link href="/upload">Start_Journey</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14]" asChild>
          <Link href="/upload">Dev Guide</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <section className="mb-32">
        <h2 className="text-5xl text-center mb-16 text-[#4fd1c5]">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: 'Upload', icon: '📤', description: 'Securely upload your AI datasets to our decentralized network.' },
            { step: 'Store', icon: '💾', description: 'Your data is distributed across multiple nodes for enhanced security and availability.' },
            { step: 'Retrieve', icon: '📥', description: 'Access your datasets anytime, anywhere with lightning-fast speeds with encrypted securities.' },
            {step: 'ReputationManagement', icon: '📈', description: 'Track Ai agents performance, invest smart - invest safe'}
          ].map((item, index) => (
            <div key={item.step} className="bg-[#0a0b14]/50 backdrop-blur-sm border border-[#4fd1c5]/20 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl text-[#4fd1c5] mb-2">{item.step}</h3>
              <p className="text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Stats Section */}
      <LiveStats />

      {/* Partners Section */}
      <Partners />

      {/* CTA Section */}
      <section className="text-center mb-32">
        <h2 className="text-5xl mb-8 text-[#4fd1c5]">Ready to Get Started?</h2>
        <Button variant="retro" size="lg" asChild>
          <Link href="/upload">Upload Your First Dataset</Link>
        </Button>
      </section>

      {/* Footer */}
      <Footer />

      <LanguageSelector />
    </div>
  )
}

