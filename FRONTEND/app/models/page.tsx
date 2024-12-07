import { AgentCard } from "@/components/agent-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from "next/link"

const agents = [
  {
    name: "Trading Model 1",
    description: "A sophisticated AI trading model that leverages advanced algorithms for market analysis and trade execution.",
    image: "/placeholder.svg?height=200&width=300",
    isActive: false,
    fileType: "CSV",
    datasetSize: "10,000 Datapoints",
    isFree: true,
    blobID: "cyqnkuBgKRVUlOtJnMpubf3p-Cqv3IlHh-pAdTDdfMM",
  },
  {
    name: "Trading Model 2",
    description: "An intelligent trading system designed to identify and execute trades based on real-time market data and historical patterns.",
    image: "/placeholder.svg?height=200&width=300",
    isActive: true,
    fileType: "JSON",
    datasetSize: "25,000 Datapoints",
    isFree: false,
    price: 99,
    blobID: "tmeX1Fl9s2bP-kFdytLyjKi7Oc_i8xIS6QH6Z3_lMe0",
  },
  // Add more agents as needed
]

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">AI Models</h1>
        <Link href="/create-model">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create Model
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
