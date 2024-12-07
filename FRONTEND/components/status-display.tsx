interface StatusDisplayProps {
    status: string
  }
  
  export function StatusDisplay({ status }: StatusDisplayProps) {
    return status ? (
      <div className="mt-4 p-4 bg-[#1a1b2e] border border-[#4fd1c5]/30 rounded-lg text-[#4fd1c5]">
        {status}
      </div>
    ) : null
  }
  
  