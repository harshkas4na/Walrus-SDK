import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DownloadSectionProps {
  downloadBlobId: string
  setDownloadBlobId: (value: string) => void
  handleDownload: () => void
  showPasswordInput?: boolean
  downloadPassword?: string
  setDownloadPassword?: (value: string) => void
}

export function DownloadSection({
  downloadBlobId,
  setDownloadBlobId,
  handleDownload,
  showPasswordInput = false,
  downloadPassword = '',
  setDownloadPassword
}: DownloadSectionProps) {
  return (
    <div>
      <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">Download</h3>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          value={downloadBlobId}
          onChange={(e) => setDownloadBlobId(e.target.value)}
          placeholder="Enter Blob ID"
          className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300 flex-grow"
        />
      </div>
      {showPasswordInput && (
        <div className="flex gap-4 mb-4">
          <Input
            type="password"
            value={downloadPassword}
            onChange={(e) => setDownloadPassword && setDownloadPassword(e.target.value)}
            placeholder="Enter Password"
            className="bg-[#1a1b2e] border-[#4fd1c5]/30 text-white focus:border-[#4fd1c5] transition-colors duration-300 flex-grow"
          />
        </div>
      )}
      <Button onClick={handleDownload} className="w-full bg-[#4fd1c5] text-[#0a0b14] hover:bg-[#4fd1c5]/80 transition-colors duration-300">
        Download
      </Button>
    </div>
  )
}

