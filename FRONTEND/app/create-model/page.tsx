"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
const SDK = require("walrus-sdk");

export default function CreateAgent() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fileType: "",
    datasetSize: "",
    isFree: true,
    price: "",
    blobID: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState({ type: "", message: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const sdk = new SDK()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isFree: checked }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const updateStatus = (type: string, message: string) => {
    setStatus({ type, message })
  }

  const resetStatus = () => {
    setStatus({ type: "", message: "" })
    setProgress(0)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      updateStatus("error", "Please select a file to upload")
      return
    }

    setIsProcessing(true)
    resetStatus()

    try {
      const result = await sdk.storeFile(selectedFile, 5)
      const uploadedBlobId = result.alreadyCertified.blobId || result.newlyCreated.blobId;
      setFormData(prev => ({ ...prev, blobID: uploadedBlobId }))
      setProgress(100)
      updateStatus("success", `File uploaded successfully! Blob ID: ${uploadedBlobId}`)
    } catch (error:any) {
      console.error("Upload failed:", error)
      updateStatus("error", `Upload failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUploadPAID = async () => {
    if (!selectedFile) {
      updateStatus("error", "Please select a file to upload")
      return
    }

    setIsProcessing(true)
    resetStatus()

    try {
      const result = await sdk.storeFileWithEncryption(selectedFile, 5, "MANI")
      const uploadedBlobId = result.newlyCreated.blobObject.blobId
      setFormData(prev => ({ ...prev, blobID: uploadedBlobId }))
      setProgress(100)
      updateStatus("success", `File uploaded successfully! Blob ID: ${uploadedBlobId}`)
    } catch (error:any) {
      console.error("Upload failed:", error)
      updateStatus("error", `Upload failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text font-bold">Create AI Agent</h1>
      <p className="text-center text-gray-400 mb-8">Fill in the details to create a new AI Agent</p>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-gray-800/60 p-8 rounded-lg shadow-lg">
        <div>
          <Label htmlFor="name">Agent Name</Label>
          <Input 
            id="name" 
            name="name" 
            className="text-gray-800"
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Enter agent name"
            required 
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description"
            className="text-gray-800" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Describe the agent's functionality"
            required 
          />
        </div>
        <div className="text-gray-800">
          <Label htmlFor="fileType">File Type</Label>
          <Select name="fileType" onValueChange={(value) => handleSelectChange("fileType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="XML">XML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="datasetSize">Dataset Size</Label>
          <Input 
            id="datasetSize" 
            name="datasetSize"
            className="text-gray-800" 
            value={formData.datasetSize} 
            onChange={handleInputChange} 
            placeholder="e.g., 10,000 Datapoints"
            required 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="isFree" 
            checked={formData.isFree} 
            onCheckedChange={handleSwitchChange} 
          />
          <Label htmlFor="isFree">Free Dataset</Label>
        </div>
        {!formData.isFree && (
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              className="text-gray-800"
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="Enter price"
              required 
            />
          </div>
        )}
        <div>
          <Label htmlFor="file-upload" className="block text-[#4fd1c5] mb-2">Select a file to upload</Label>
          <Input 
            id="file-upload" 
            type="file" 
            onChange={handleFileChange} 
            className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300"
          />
        </div>
        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            onClick={formData.isFree ? handleUpload : handleUploadPAID}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isProcessing}
          >
            {isProcessing ? "Uploading..." : formData.isFree ? "Upload Free Dataset" : "Upload Paid Dataset"}
          </Button>
        </div>
        {status.message && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
        {isProcessing && <Progress value={progress} className="w-full" />}
        <div>
          <Label htmlFor="blobID">Blob ID</Label>
          <Input 
            id="blobID" 
            name="blobID" 
            value={formData.blobID} 
            onChange={handleInputChange} 
            placeholder="Blob ID will appear here after upload"
            disabled
          />
        </div>
        <div className="flex justify-between pt-4">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 ease-in-out">
            Create Model
          </Button>
          <Button variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-600/10 transition-all duration-200 ease-in-out">
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

