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
import { DownloadSection } from '@/components/download-section'
import { UploadSection } from '@/components/upload-section'
import { StatusDisplay } from '@/components/status-display'
import { CodeExample } from '@/components/code-example'
import { InstallationStep } from '@/components/installation-step'

const StorageSDK = require("walrus-sdk");

export default function StorageSDKDemo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')
  const [uploadedBlobId, setUploadedBlobId] = useState('')
  const [downloadBlobId, setDownloadBlobId] = useState('')
  const [filePassword, setFilePassword] = useState('')
  const [downloadPassword, setDownloadPassword] = useState('')
  const { toast } = useToast()

  const storage = new StorageSDK();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleFilePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilePassword(event.target.value)
  }

 
  const handleUpload = async () => {
    console.log("trigered");
    if (!selectedFile) {
      setStatus("Please select a file to upload")
      return
    }

    try {
      setStatus("Uploading...")
      
      const result = await storage.storeFile(selectedFile, 5)
      const blobId = result.newlyCreated.blobObject.blobId

      console.log("result", blobId)
      setUploadedBlobId(blobId)
      setStatus("Upload complete! Blob ID: " + blobId)
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
      console.error(err)
    }
  }

  const handleUploadWithEncryption = async () => {
    if (!selectedFile) {
      setStatus("Please select a file to upload")
      return
    }

    if (!filePassword) {
      setStatus("Please enter a password for encryption")
      return
    }

    try {
      setStatus("Uploading...")
      const result = await storage.storeFileWithEncryption(selectedFile, 5, filePassword)
      const blobId = result.newlyCreated.blobObject.blobId

      console.log("result", blobId)
      setUploadedBlobId(blobId)
      setStatus("Upload complete! Blob ID: " + blobId)
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
      console.error(err)
    }
  }

  const handleDownload = async () => {

    if (!downloadBlobId.trim()) {
      setStatus("Please enter a Blob ID to download")
      return
    }


    try {
      setStatus("Downloading...")
      const blob = await storage.readFile(downloadBlobId)

      // await downloadStreamAsFile(blob, "download")
      
      console.log("blob", blob);

      await downloadStreamAsFile(blob,"download")
   

      setStatus("Download complete!")
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      console.error("Download error:", error)
    }
  };

  async function downloadStreamAsFile(stream:any, suggestedFileName = "download") {
    try {
      const reader = stream.getReader();
      const firstChunk = await reader.read();
      reader.releaseLock();
      const fileType = detectFileType(firstChunk.value);
      const newStream = new ReadableStream({
        start(controller) {
          controller.enqueue(firstChunk.value);
        },
        async pull(controller) {
          const reader = stream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
          reader.releaseLock();
        },
      });
      const response = new Response(newStream);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${suggestedFileName}${getFileExtension(fileType)}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }

 
  

  const handleDownloadWithEncryption = async () => {
    if (!downloadBlobId.trim()) {
      setStatus("Please enter a Blob ID to download")
      return
    }

    if (!downloadPassword) {
      setStatus("Please enter the password for decryption")
      return
    }

    try {
      setStatus("Downloading...")
      const blob = await storage.readFileWithDecryption(downloadBlobId, downloadPassword)
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `file-${downloadBlobId}`
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)

      setStatus("Download complete!")
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
      console.error("Download error:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The text has been copied to your clipboard.",
    })
  }

  function detectFileType(bytes:any) {
    const arr = new Uint8Array(bytes);
    if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      arr[0] === 0x89 &&
      arr[1] === 0x50 &&
      arr[2] === 0x4e &&
      arr[3] === 0x47
    ) {
      return "image/png";
    }
    if (
      arr[0] === 0x25 &&
      arr[1] === 0x50 &&
      arr[2] === 0x44 &&
      arr[3] === 0x46
    ) {
      return "application/pdf";
    }
    return "application/octet-stream";
  }
  function getFileExtension(mimeType: 'image/jpeg' | 'image/png' | 'application/pdf' | 'application/octet-stream'): string {
    const extensions: { [key: string]: string } = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "application/pdf": ".pdf",
        "application/octet-stream": "",
    };
    return extensions[mimeType] || "";
}

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Installation Guide Section */}
      <section className="mb-20">
        <h2 className="text-4xl sm:text-5xl text-center mb-12 text-[#4fd1c5] font-bold tracking-tight">Installation Guide</h2>
        <div className="space-y-8">
          <InstallationStep
            title="Step 1: Installing the SDK"
            code="npm i walrus-sdk"
            onCopy={() => copyToClipboard('npm i walrus-sdk')}
          />
          <InstallationStep
            title="Step 2: Import in the project"
            code="const StorageSDK = require('walrus-sdk');"
            onCopy={() => copyToClipboard('const StorageSDK = require("walrus-sdk");')}
          />
          <CodeExample
            title="Uploading data without encryption example"
            code={`const handleUpload = async () => {
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
};`}
            onCopy={() => copyToClipboard(handleUpload.toString())}
          />
          <CodeExample
            title="Uploading data with encryption example"
            code={`const handleUploadWithEncryption = async () => {
  if (!selectedFile) {
    setStatus("Please select a file to upload");
    return;
  }

  if (!filePassword) {
    setStatus("Please enter a password for encryption");
    return;
  }

  try {
    setStatus("Uploading...");
    const result = await storage.storeFileWithEncryption(selectedFile, 5, filePassword);
    const blobId = result.newlyCreated.blobObject.blobId;

    console.log("result", blobId);
    setUploadedBlobId(blobId);
    setStatus("Upload complete! Blob ID: " + blobId);
  } catch (err) {
    setStatus(\`Error: \${err.message}\`);
    console.error(err);
  }
};`}
            onCopy={() => copyToClipboard(handleUploadWithEncryption.toString())}
          />
          <CodeExample
            title="Downloading data without encryption"
            code={`const handleDownload = async () => {
  if (!downloadBlobId.trim()) {
    setStatus("Please enter a Blob ID to download");
    return;
  }

  try {
    setStatus("Downloading...");
    const blob = await storage.readFile(downloadBlobId);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = \`file-\${downloadBlobId}\`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);

    setStatus("Download complete!");
  } catch (error) {
    setStatus(\`Error: \${error.message}\`);
    console.error("Download error:", error);
  }
};`}
            onCopy={() => copyToClipboard(handleDownload.toString())}
          />
          <CodeExample
            title="Downloading data with encryption"
            code={`const handleDownloadWithEncryption = async () => {
  if (!downloadBlobId.trim()) {
    setStatus("Please enter a Blob ID to download");
    return;
  }

  if (!downloadPassword) {
    setStatus("Please enter the password for decryption");
    return;
  }

  try {
    setStatus("Downloading...");
    const blob = await storage.readFileWithDecryption(downloadBlobId, downloadPassword);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = \`file-\${downloadBlobId}\`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);

    setStatus("Download complete!");
  } catch (error) {
    setStatus(\`Error: \${error.message}\`);
    console.error("Download error:", error);
  }
};`}
            onCopy={() => copyToClipboard(handleDownloadWithEncryption.toString())}
          />
        </div>
      </section>

      {/* Upload and Download Example Section */}
      <section className="mb-20">
        <h2 className="text-4xl sm:text-5xl text-center mb-12 text-[#4fd1c5] font-bold tracking-tight">SDK Demo (Without Encryption)</h2>
        <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
          <UploadSection
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />
          <DownloadSection
            downloadBlobId={downloadBlobId}
            setDownloadBlobId={setDownloadBlobId}
            handleDownload={handleDownload}
          />
          <StatusDisplay status={status} />
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl sm:text-5xl text-center mb-12 text-[#4fd1c5] font-bold tracking-tight">SDK Demo (With Encryption)</h2>
        <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
          <UploadSection
            handleFileChange={handleFileChange}
            handleUpload={handleUploadWithEncryption}
            showPasswordInput
            filePassword={filePassword}
            handleFilePasswordChange={handleFilePasswordChange}
          />
          <DownloadSection
            downloadBlobId={downloadBlobId}
            setDownloadBlobId={setDownloadBlobId}
            handleDownload={handleDownloadWithEncryption}
            showPasswordInput
            downloadPassword={downloadPassword}
            setDownloadPassword={setDownloadPassword}
          />
          <StatusDisplay status={status} />
        </div>
      </section>
      <LanguageSelector />
      <Toaster />
    </div>
  )
}

