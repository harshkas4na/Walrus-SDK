"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Loader2 } from 'lucide-react'

interface AgentCardProps {
  name: string
  description: string
  image: string
  isActive: boolean
  fileType: string
  datasetSize: string
  isFree: boolean
  price?: number
  blobID: string
}

export function AgentCard({
  name,
  description,
  image,
  isActive,
  fileType,
  datasetSize,
  isFree,
  price,
  blobID,
}: AgentCardProps) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [isPurchased, setPurchased] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  const handleBuy = () => {
    setModalOpen(true)
    setIsBuying(true)
    setTimeout(() => {
      setIsBuying(false)
      setPurchased(true)
    }, 2000) // Fake buying process
  }

  const handleUse = () => setModalOpen(true)

  return (
    <Card className="overflow-hidden bg-gray-900/50 transition-colors hover:bg-gray-900/70">
      <CardHeader className="p-0">
        <div className="relative h-48">
          <Image src={image} alt={name} fill className="object-cover" />
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
            <span className="text-gray-500">File Type</span>
            <p className="font-medium text-gray-200">{fileType}</p>
          </div>
          <div>
            <span className="text-gray-500">Size</span>
            <p className="font-medium text-gray-200">{datasetSize}</p>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-gray-500">Pricing</span>
          <p className="font-medium text-gray-200">
            {isFree ? "Free" : `$${price}`}
          </p>
        </div>

        <div className="mt-4">
          {isFree || isPurchased ? (
            <Button className="w-full" onClick={handleUse}>
              Use
            </Button>
          ) : (
            <Button className="w-full" onClick={handleBuy}>
              Buy
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          {isFree || isPurchased ? (
            <>
              <DialogHeader>
                <DialogTitle>Use Dataset</DialogTitle>
                <DialogDescription>
                  Enter the required information to use this dataset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="blobId" className="text-right">
                    BlobID
                  </Label>
                  <Input id="blobId" value={blobID} className="col-span-3" readOnly />
                </div>
                {!isFree && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input id="password" value="DataLinks" className="col-span-3" readOnly />
                  </div>
                )}
              </div>
              <Button className="w-full" onClick={() => setModalOpen(false)}>
                Download
              </Button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogDescription>
                  You are purchasing this dataset for <span className="font-bold">${price}</span>.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex justify-center">
                {isBuying ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Button className="w-full" onClick={() => setModalOpen(false)}>
                    Complete Purchase
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

