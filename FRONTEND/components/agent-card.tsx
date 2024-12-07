import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"

interface AgentCardProps {
  name: string
  description: string
  image: string
  isActive: boolean
  riskLevel: string
  stopLoss: number
  roles: string[]
  target: number
  targetDate: string
}

export function AgentCard({
  name,
  description,
  image,
  isActive,
  riskLevel,
  stopLoss,
  roles,
  target,
  targetDate,
}: AgentCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-900/50 transition-colors hover:bg-gray-900/70">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
          <Badge
            variant={isActive ? "success" : "destructive"}
            className="absolute right-2 top-2"
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{description}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Risk Level</span>
            <p className="font-medium text-gray-200">{riskLevel}</p>
          </div>
          <div>
            <span className="text-gray-500">Stop Loss</span>
            <p className="font-medium text-gray-200">${stopLoss}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="bg-gray-800/50 text-gray-300"
            >
              {role}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500">Target: </span>
            <span className="text-gray-200">${target}</span>
          </div>
          <span className="text-gray-400">{targetDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}

