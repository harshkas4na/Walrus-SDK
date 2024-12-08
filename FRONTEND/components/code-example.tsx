import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';

interface CodeExampleProps {
  title: string;
  code: string;
  onCopy: () => void;
}

export function CodeExample({ title, code, onCopy }: CodeExampleProps) {
  return (
    <div className="bg-[#0a0b14]/70 backdrop-blur-lg border border-[#4fd1c5]/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-[#4fd1c5]/20 hover:border-[#4fd1c5]/50">
      <h3 className="text-2xl text-[#4fd1c5] mb-4 font-semibold">{title}</h3>
      <div className="bg-[#1a1b2e] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <pre className="text-white overflow-x-auto max-w-full sm:max-w-[calc(100%-3rem)] text-xs sm:text-sm mb-4 sm:mb-0">
          <code className="language-javascript">
            {code.split('\n').map((line, i) => {
              const constLetVarMatch = line.match(/^(const|let|var|if|try|catch)/);
              const asyncAwaitReturnMatch = line.match(/\b(async|await|return)\b/);
              const stringMatch = line.match(/(".*?"|'.*?'|`.*?`)/);
              const specificWordsMatch = line.match(/\b(setStatus|console|storage)\b/);

              return (
                <span key={i} className="block">
                  <span className="text-gray-500">{i + 1}</span>
                  <span className="text-yellow-500">
                    {constLetVarMatch ? ' ' + constLetVarMatch[0] : ''}
                  </span>
                  <span className="text-blue-400">
                    {asyncAwaitReturnMatch ? ' ' + asyncAwaitReturnMatch[0] : ''}
                  </span>
                  <span className="text-green-400">
                    {stringMatch ? ' ' + stringMatch[0] : ''}
                  </span>
                  <span className="text-purple-400">
                    {specificWordsMatch ? ' ' + specificWordsMatch[0] : ''}
                  </span>
                  <span className="text-white">
                    {line
                      .replace(/^(const|let|var|if|try|catch)/, '')
                      .replace(/\b(async|await|return)\b/, '')
                      .replace(/(".*?"|'.*?'|`.*?`)/, '')
                      .replace(/\b(setStatus|console|storage)\b/, '')}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="sm:ml-2 bg-transparent border-[#4fd1c5] text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-[#0a0b14] transition-colors duration-300"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
