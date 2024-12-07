import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
  { name: 'Dr. Emily Chen', role: 'AI Researcher, TechUniversity', quote: 'Walrus has revolutionized how we store and access our research datasets. The decentralized approach ensures our data is always available and secure.' },
  { name: 'Mark Johnson', role: 'CTO, AIStartup', quote: 'The speed and reliability of Walrus is unmatched. It\'s a game-changer for our AI model training operations.' },
  { name: 'Sarah Lee', role: 'Data Scientist, Global Corp', quote: 'Walrus made it possible for us to collaborate on large-scale AI projects across multiple teams and locations. The data monetization feature is an added bonus!' },
]

export function Testimonials() {
  return (
    <section className="mb-32">
      <h2 className="text-5xl text-center mb-16 text-[#4fd1c5]">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-[#0a0b14] border-[#4fd1c5]/20">
            <CardHeader>
              <CardTitle className="text-xl text-[#4fd1c5]">{testimonial.name}</CardTitle>
              <p className="text-white/60">{testimonial.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 italic">"{testimonial.quote}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

