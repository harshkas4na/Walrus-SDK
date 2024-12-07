import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    id: 1,
    icon: '🔒',
    title: 'Decentralized Security',
    description: 'Store your AI datasets across multiple nodes, enhancing security and reducing data loss risk.',
    color: 'bg-[#4fd1c5]',
  },
  {
    id: 2,
    icon: '💰',
    title: 'Data Monetization',
    description: 'Earn rewards through our native token-based system for sharing valuable datasets.',
    color: 'bg-[#b794f4]',
  },
  {
    id: 3,
    icon: '🤝',
    title: 'Collaborative Curation',
    description: 'Engage with the community through dataset annotation and version control features.',
    color: 'bg-[#4fd1c5]',
  },
  {
    id: 4,
    icon: '🔗',
    title: 'Blockchain Integration',
    description: 'Seamlessly integrate with major blockchain networks and AI platforms.',
    color: 'bg-[#b794f4]',
  },
]

export function Features() {
  return (
    <section className="mb-32">
      <h2 className="text-5xl text-center mb-16 text-[#4fd1c5]">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <Card key={feature.id} className="bg-[#0a0b14] border-[#4fd1c5]/20">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-2xl text-[#4fd1c5]">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

