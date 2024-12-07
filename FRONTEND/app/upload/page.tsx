'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from 'lucide-react'
import { LanguageSelector } from '@/components/language-selector'
import { Footer } from '@/components/footer'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const StorageSDK = require("sdk-demo-1111");

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [uploadedBlobId, setUploadedBlobId] = useState('')
  const [downloadBlobId, setDownloadBlobId] = useState('')
  const { toast } = useToast()

  const storage = new StorageSDK();
  let isFirstAttempt = true

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
  
      console.log("result", blobId);
      setUploadedBlobId(blobId);
      setStatus("Upload complete! Blob ID: " + blobId);
      isFirstAttempt = true; // Reset for next upload
      toast({
        title: "Upload Successful",
        description: `File uploaded successfully. Blob ID: ${blobId}`,
      })
    } catch (err: any) {
      if (isFirstAttempt) {
        toast({
          title: "Upload didn't complete",
          description: "Please try uploading once more. It should work on the second attempt.",
          variant: "default",
        })
        isFirstAttempt = false;
      } else {
        setStatus(`Error: ${err.message}`);
        console.error(err);
        toast({
          title: "Upload Error",
          description: `An error occurred: ${err.message}`,
          variant: "destructive",
        })
      }
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
      toast({
        title: "Download Successful",
        description: "Your file has been downloaded successfully.",
      })
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      console.error("Download error:", error)
      toast({
        title: "Download Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      })
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setStatus('Copied to clipboard!')
    setTimeout(() => setStatus(''), 2000)
    toast({
      title: "Copied to Clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Installation Guide Section */}
      <section className="mb-20">
        <h2 className="text-4xl sm:text-5xl text-center mb-12 text-[#4fd1c5] font-bold tracking-tight">Installation Guide</h2>
        <div className="space-y-8">
          <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Step 1: Installing the SDK</h3>
            <div className="bg-[#1a1b2e] p-4 rounded-lg flex justify-between items-center">
              <code className="text-white text-sm sm:text-base">npm i sdk-demo-1111</code>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyToClipboard('npm i sdk-demo-1111')} 
                className="ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Step 2: Import in the project</h3>
            <div className="bg-[#1a1b2e] p-4 rounded-lg flex justify-between items-center">
              <code className="text-white text-sm sm:text-base">const StorageSDK = require("sdk-demo-1111");</code>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyToClipboard('const StorageSDK = require("sdk-demo-1111");')} 
                className="ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Uploading data example</h3>
            <div className="bg-[#1a1b2e] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <pre className="text-white overflow-x-auto max-w-full sm:max-w-[calc(100%-3rem)] text-xs sm:text-sm mb-4 sm:mb-0">
                <code className="language-javascript">
                  {`const handleUpload = async () => {
  if (!selectedFile) {
    setStatus("Please select a file to upload");
    return;
  }

  try {
    setStatus("Uploading...");
    const result = await storage.storeFile(selectedFile, 5);
    const blobId = result.alreadyCertified.blobId || result.newlyCreated.blobId;

    console.log("result", blobId);
    setUploadedBlobId(blobId);
    setStatus("Upload complete! Blob ID: " + blobId);
  } catch (err) {
    setStatus(\`Error: \${err.message}\`);
    console.error(err);
  }
};`.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      <span className="text-gray-500">{i + 1}</span>
                      <span className="text-yellow-500">{line.match(/^(const|let|var|if|try|catch)/) ? ' ' + line.match(/^(const|let|var|if|try|catch)/)[0] : ''}</span>
                      <span className="text-blue-400">{line.match(/\b(async|await|return)\b/) ? ' ' + line.match(/\b(async|await|return)\b/)[0] : ''}</span>
                      <span className="text-green-400">{line.match(/(".*?"|'.*?')/) ? ' ' + line.match(/(".*?"|'.*?')/)[0] : ''}</span>
                      <span className="text-purple-400">{line.match(/\b(setStatus|console|storage)\b/) ? ' ' + line.match(/\b(setStatus|console|storage)\b/)[0] : ''}</span>
                      <span className="text-white">{line.replace(/^(const|let|var|if|try|catch)/, '').replace(/\b(async|await|return)\b/, '').replace(/(".*?"|'.*?')/, '').replace(/\b(setStatus|console|storage)\b/, '')}</span>
                    </span>
                  ))}
                </code>
              </pre>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyToClipboard(`const handleUpload = async () => {
  if (!selectedFile) {
    setStatus("Please select a file to upload");
    return;
  }

  try {
    setStatus("Uploading...");
    const result = await storage.storeFile(selectedFile, 5);
    const blobId = result.alreadyCertified.blobId || result.newlyCreated.blobId;

    console.log("result", blobId);
    setUploadedBlobId(blobId);
    setStatus("Upload complete! Blob ID: " + blobId);
  } catch (err) {
    setStatus(\`Error: \${err.message}\`);
    console.error(err);
  }
};`)} 
                className="sm:ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Downloading data with blobId</h3>
            <div className="bg-[#1a1b2e] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <pre className="text-white overflow-x-auto max-w-full sm:max-w-[calc(100%-3rem)] text-xs sm:text-sm mb-4 sm:mb-0">
                <code className="language-javascript">
                  {`const handleDownload = async () => {
  if (!downloadBlobId.trim()) {
    setStatus("Please enter a Blob ID to download")
    return
  }

  try {
    setStatus("Downloading...")
    const data = await fetch(
      \`https://aggregator.walrus-testnet.walrus.space/v1/\${downloadBlobId}\`
    )

    if (!data.body) {
      throw new Error("No body found in the response")
    }

    await downloadStreamAsFile(data.body, \`file-\${downloadBlobId}\`)
    setStatus("Download complete!")
  } catch (error) {
    setStatus(\`Error: \${error.message}\`)
    console.error("Download error:", error)
  }
}`.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      <span className="text-gray-500">{i + 1}</span>
                      <span className="text-yellow-500">{line.match(/^(const|let|var|if|try|catch)/) ? ' ' + line.match(/^(const|let|var|if|try|catch)/)[0] : ''}</span>
                      <span className="text-blue-400">{line.match(/\b(async|await|return)\b/) ? ' ' + line.match(/\b(async|await|return)\b/)[0] : ''}</span>
                      <span className="text-green-400">{line.match(/(".*?"|'.*?'|`.*?`)/) ? ' ' + line.match(/(".*?"|'.*?'|`.*?`)/)[0] : ''}</span>
                      <span className="text-purple-400">{line.match(/\b(setStatus|console|fetch)\b/) ? ' ' + line.match(/\b(setStatus|console|fetch)\b/)[0] : ''}</span>
                      <span className="text-white">{line.replace(/^(const|let|var|if|try|catch)/, '').replace(/\b(async|await|return)\b/, '').replace(/(".*?"|'.*?'|`.*?`)/, '').replace(/\b(setStatus|console|fetch)\b/, '')}</span>
                    </span>
                  ))}
                </code>
              </pre>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => copyToClipboard(`const handleDownload = async () => {
  if (!downloadBlobId.trim()) {
    setStatus("Please enter a Blob ID to download")
    return
  }

  try {
    setStatus("Downloading...")
    const data = await fetch(
      \`https://aggregator.walrus-testnet.walrus.space/v1/\${downloadBlobId}\`
    )

    if (!data.body) {
      throw new Error("No body found in the response")
    }

    await downloadStreamAsFile(data.body, \`file-\${downloadBlobId}\`)
    setStatus("Download complete!")
  } catch (error) {
    setStatus(\`Error: \${error.message}\`)
    console.error("Download error:", error)
  }
}`)} 
                className="sm:ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upload and Download Example Section */}
      <section className="mb-20">
        <h2 className="text-4xl sm:text-5xl text-center mb-12 text-[#4fd1c5] font-bold tracking-tight">SDK Demo</h2>
        <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
          <div className="mb-8">
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Upload</h3>
            <div className="mb-4">
              <Label htmlFor="file-upload" className="block text-[#4fd1c5] mb-2">Select a file to upload</Label>
              <Input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange} 
                className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300"
              />
            </div>
            <Button onClick={handleUpload} className="w-full bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80 transition-colors duration-300">
              Upload File
            </Button>
          </div>
          <div>
            <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Download</h3>
            <div className="flex gap-4">
              <Input
                type="text"
                value={downloadBlobId}
                onChange={(e) => setDownloadBlobId(e.target.value)}
                placeholder="Enter Blob ID"
                className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300 flex-grow"
              />
              <Button onClick={handleDownload} className="bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80 transition-colors duration-300">
                Download
              </Button>
            </div>
          </div>
          {status && (
            <div className="mt-4 p-4 bg-[#1a1b2e] border border-[#4fd1c5]/30 rounded-lg text-[#4fd1c5]">
              {status}
            </div>
          )}
        </div>
      </section>
      <LanguageSelector />
      <Toaster />
    </div>
  )
}


