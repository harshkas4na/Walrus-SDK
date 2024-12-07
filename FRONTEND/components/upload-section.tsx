import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadSectionProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleUpload: () => void
  showPasswordInput?: boolean
  filePassword?: string
  handleFilePasswordChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadSection({
  handleFileChange,
  handleUpload,
  showPasswordInput = false,
  filePassword = '',
  handleFilePasswordChange
}: UploadSectionProps) {
  return (
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
      {showPasswordInput && (
        <div className="mb-4">
          <Label htmlFor="upload-password" className="block text-[#4fd1c5] mb-2">Set a Password</Label>
          <Input 
            id="upload-password" 
            type="password" 
            value={filePassword}
            onChange={handleFilePasswordChange} 
            className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300"
          />
        </div>
      )}
      <Button onClick={handleUpload} className="w-full bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80 transition-colors duration-300">
        Upload File
      </Button>
    </div>
  )
}

