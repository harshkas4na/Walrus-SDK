"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "",
    stopLoss: "",
    target: "",
    targetDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-8 text-center text-[#4fd1c5]">Create AI Trading Agent</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label htmlFor="name">Agent Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="riskLevel">Risk Level</Label>
          <Select name="riskLevel" onValueChange={(value) => handleSelectChange("riskLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input id="stopLoss" name="stopLoss" type="number" value={formData.stopLoss} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="target">Target</Label>
          <Input id="target" name="target" type="number" value={formData.target} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input id="targetDate" name="targetDate" type="date" value={formData.targetDate} onChange={handleInputChange} required />
        </div>
        <div className="flex justify-between">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Create Agent
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

