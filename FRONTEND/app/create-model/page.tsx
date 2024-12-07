"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import SDK from "sdk-demo-1111";

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
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blobId, setBlobId] = useState(""); // Add this to store the blobId

  const sdk = new SDK();

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

  const handleSubmit = (e: React.FormEvent) => {
    if (!file || !password) {
      updateStatus("error", "Please select a file and enter a password");
      return;
    }

    setIsProcessing(true);
    resetStatus();

    try {
      // Generate encryption key
      const result = await sdk.storeFile(file, 5);

      console.log(result);

      const uploadedBlobId = result.newlyCreated.blobObject.blobId;
      setBlobId(uploadedBlobId); // Store the blobId

      setProgress(100);
      updateStatus(
        "success",
        `File uploaded successfully! Blob ID: ${uploadedBlobId}`
      );
    } catch (error) {
      console.error("Upload failed:", error);
      updateStatus("error", `Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }
  const handleSubmitPAID = (e: React.FormEvent) => {
    if (!file || !password) {
      updateStatus("error", "Please select a file and enter a password");
      return;
    }

    setIsProcessing(true);
    resetStatus();

    try {
      // Generate encryption key
      const result = await sdk.storeFileWithEncryption(file, 5, "MANI");

      console.log(result);

      const uploadedBlobId = result.newlyCreated.blobObject.blobId;
      setBlobId(uploadedBlobId); // Store the blobId

      setProgress(100);
      updateStatus(
        "success",
        `File uploaded successfully! Blob ID: ${uploadedBlobId}`
      );
    } catch (error) {
      console.error("Upload failed:", error);
      updateStatus("error", `Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
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
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Describe the agent's functionality"
            required 
          />
        </div>
        <div>
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
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="Enter price"
              required 
            />
          </div>
        )}
        <div>
          <Label htmlFor="blobID">Blob ID</Label>
          <Input 
            id="blobID" 
            name="blobID" 
            value={formData.blobID} 
            onChange={handleInputChange} 
            placeholder="Enter Blob ID"
            required 
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

