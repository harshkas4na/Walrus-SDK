import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features= [
  {
    id: 1,
    icon: '👩‍💻',
    title: 'Developer Friendly SDK',
    description: 'A sdk built on walrus HTTP Publisher and Aggregator that can be used directly by developers in the projects',
    color: 'bg-[#4fd1c5]',
  },
  {
    id: 2,
    icon: '🔒',
    title: 'Encryption/Decryption Layer',
    description: 'Added an encryption and decryption feature to SDK to encrypt the data before being publicly available to nodes',
    color: 'bg-[#b794f4]',
  },
  {
    id: 3,
    icon: '💻',
    title: 'No-code platform',
    description: 'Providing with a ready to use no code platform built upon the sdk for publishing and Aggregation both with and without encryption',
    color: 'bg-[#4fd1c5]',
  },
  {
    id: 4,
    icon: '📖',
    title: 'Simple Docs',
    description: 'Providing an user friendly doccumentation with step by step approach to use the sdk in normal projects',
    color: 'bg-[#b794f4]',
  },
]

export function FeaturesWalrus() {
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

