import { Button } from "@/components/ui/button"
import { Copy } from 'lucide-react'

interface InstallationStepProps {
  title: string
  code: string
  onCopy: () => void
}

export function InstallationStep({ title, code, onCopy }: InstallationStepProps) {
  return (
    <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
      <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">{title}</h3>
      <div className="bg-[#1a1b2e] p-4 rounded-lg flex justify-between items-center">
        <code className="text-white text-sm sm:text-base">{code}</code>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onCopy} 
          className="ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
