import { AgentCard } from "@/components/agent-card"
import { Button } from "@/components/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const agents = [
  {
    name: "Trading Agent 1",
    description: "A sophisticated AI trading agent that leverages advanced algorithms",
    image: "/placeholder.svg?height=200&width=300",
    isActive: false,
    riskLevel: "Conservative",
    stopLoss: 632,
    roles: ["Analyst", "Trader"],
    target: 3205,
    targetDate: "9/17/2024",
  },
  {
    name: "Trading Agent 2",
    description: "An intelligent trading system designed to identify and execute trades",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
    riskLevel: "Moderate",
    stopLoss: 1005,
    roles: ["Trader", "Observer"],
    target: 5607,
    targetDate: "9/23/2024",
  },
  // Add more agents as needed
]

export default function Home() {
  return (
    <div className="container mx-auto p-6">
        <div className="absolute top-4 w-60 right-4">
            <Link href="/create-model">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create Agent
            </Button>
            </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>
    </div>
  )
}

