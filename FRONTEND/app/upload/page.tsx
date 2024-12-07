'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
const StorageSDK = require("sdk-demo-1111");


export default function UploadDataset() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")
  const [uploadedBlobId, setUploadedBlobId] = useState("")
  const [downloadBlobId, setDownloadBlobId] = useState("")
  const [datasetName, setDatasetName] = useState("")
  const [datasetDescription, setDatasetDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const storage = new StorageSDK();

  const nextStep = () => {
    setStep(step + 1)
    setProgress((step / 3) * 100)
  }

  const prevStep = () => {
    setStep(step - 1)
    setProgress(((step - 2) / 3) * 100)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus("Please select a file to upload");
      return;
    }
  
    try {
      setStatus("Uploading...");
      const result = await storage.storeFile(selectedFile, 5);
      const blobId = result.alreadyCertified.blobId || result.newlyCreated.blobId;
  
      console.log("result", blobId); // Ensure it logs the correct Blob ID
      setUploadedBlobId(blobId);
      setStatus("Upload complete! Blob ID: " + blobId); // Use the resolved `blobId`
    } catch (err) {
      setStatus(`Error: ${err.message}`);
      console.error(err);
    }
  };
  

  const handleDownload = async () => {
    if (!downloadBlobId.trim()) {
      setStatus("Please enter a Blob ID to download")
      return
    }

    try {
      setStatus("Downloading...")
      const data = await fetch(
        `https://aggregator.walrus-testnet.walrus.space/v1/${downloadBlobId}`
      )

      if (!data.body) {
        throw new Error("No body found in the response")
      }

      await downloadStreamAsFile(data.body, `file-${downloadBlobId}`)
      setStatus("Download complete!")
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      console.error("Download error:", error)
    }
  }

  async function downloadStreamAsFile(stream: ReadableStream, suggestedFileName = "download") {
    try {
      const reader = stream.getReader()
      const firstChunk = await reader.read()
      reader.releaseLock()

      const fileType = detectFileType(firstChunk.value)

      const newStream = new ReadableStream({
        start(controller) {
          controller.enqueue(firstChunk.value)
        },
        async pull(controller) {
          const reader = stream.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
          controller.close()
          reader.releaseLock()
        },
      })

      const response = new Response(newStream)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${suggestedFileName}${getFileExtension(fileType)}`

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
      throw error
    }
  }

  function detectFileType(bytes: ArrayBuffer) {
    const arr = new Uint8Array(bytes)

    if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
      return "image/jpeg"
    }
    if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47) {
      return "image/png"
    }
    if (arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46) {
      return "application/pdf"
    }

    return "application/octet-stream"
  }

  function getFileExtension(mimeType: string) {
    const extensions: { [key: string]: string } = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "application/pdf": ".pdf",
      "application/octet-stream": "",
    }
    return extensions[mimeType] || ""
  }

  console.log("uploadedBlobId", uploadedBlobId)
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl md:text-7xl text-center mb-12 text-[#4fd1c5]">Upload Dataset</h1>
      <div className="max-w-2xl mx-auto bg-[#0a0b14]/50 backdrop-blur-sm border border-[#4fd1c5]/20 rounded-xl p-8">
        <Progress value={progress} className="mb-8" />
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-3xl text-[#4fd1c5] mb-4">Dataset Information</h2>
              <div>
                <Label htmlFor="dataset-name" className="text-[#4fd1c5]">Dataset Name</Label>
                <Input 
                  id="dataset-name" 
                  placeholder="Enter dataset name" 
                  className="bg-[#0a0b14] border-[#4fd1c5]/20 text-white" 
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataset-description" className="text-[#4fd1c5]">Description</Label>
                <Textarea
                  id="dataset-description"
                  placeholder="Describe your dataset"
                  className="bg-[#0a0b14] border-[#4fd1c5]/20 text-white"
                  value={datasetDescription}
                  onChange={(e) => setDatasetDescription(e.target.value)}
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-3xl text-[#4fd1c5] mb-4">Upload Files</h2>
              <div className="border-2 border-dashed border-[#4fd1c5]/40 rounded-xl p-8 text-center">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-[#4fd1c5] mb-4">Drag and drop your files here, or click to select files</p>
                <Input id="file-upload" type="file"  onChange={handleFileChange} />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14]">
                    Select Files
                  </Button>
                </Label>
              </div>
              {selectedFile && (
                <p className="text-[#4fd1c5]">Selected file: {selectedFile.name}</p>
              )}
              <Button onClick={handleUpload} className="w-full bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80">
                Upload File
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-3xl text-[#4fd1c5] mb-4">Review and Submit</h2>
              <Card className="bg-[#0a0b14] border border-[#4fd1c5]/20 rounded-lg p-4 mb-4">
                <CardContent>
                  <h3 className="text-xl text-[#4fd1c5] mb-2">Dataset Summary</h3>
                  <p className="text-white/60">Name: {datasetName}</p>
                  <p className="text-white/60">Description: {datasetDescription}</p>
                  <p className="text-white/60">Files: {selectedFile ? `1 file (${selectedFile.size} bytes)` : 'No file selected'}</p>
                  {uploadedBlobId && (
                    <p className="text-white/60">Uploaded Blob ID: {`${uploadedBlobId}`}</p>
                  )}
                </CardContent>
              </Card>
              <Button className="w-full bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80" onClick={() => setStatus("Dataset submitted successfully!")}>
                Submit Dataset
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline" className="border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14]">
              Previous
            </Button>
          )}
          {step < 3 && (
            <Button onClick={nextStep} className="ml-auto bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80">
              Next
            </Button>
          )}
        </div>
        {status && (
          <div className="mt-4 p-4 bg-[#0a0b14] border border-[#4fd1c5]/20 rounded-lg text-[#4fd1c5]">
            {status}
          </div>
        )}
      </div>
      <div className="max-w-2xl mx-auto mt-8 bg-[#0a0b14]/50 backdrop-blur-sm border border-[#4fd1c5]/20 rounded-xl p-8">
        <h2 className="text-3xl text-[#4fd1c5] mb-4">Download File</h2>
        <div className="flex gap-4">
          <Input
            type="text"
            value={downloadBlobId}
            onChange={(e) => setDownloadBlobId(e.target.value)}
            placeholder="Enter Blob ID"
            className="bg-[#0a0b14] border-[#4fd1c5]/20 text-white flex-grow"
          />
          <Button onClick={handleDownload} className="bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80">
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}

