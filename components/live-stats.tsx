'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LiveStats() {
  const [stats, setStats] = useState({
    dataStored: 0,
    activeUsers: 0,
    availableDatasets: 0,
  })

  useEffect(() => {
    // Simulating live data updates
    const interval = setInterval(() => {
      setStats(prevStats => ({
        dataStored: prevStats.dataStored + Math.floor(Math.random() * 10),
        activeUsers: prevStats.activeUsers + Math.floor(Math.random() * 5),
        availableDatasets: prevStats.availableDatasets + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="mb-32">
      <h2 className="text-5xl text-center mb-16 text-[#4fd1c5]">Live Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className="bg-[#0a0b14] border-[#4fd1c5]/20">
            <CardHeader>
              <CardTitle className="text-xl text-[#4fd1c5] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

