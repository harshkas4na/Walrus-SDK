'use client'

import { useState } from 'react'

export function LanguageSelector() {
  const [language, setLanguage] = useState('EN')
  
  return (
    <button 
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a0b14]/80 border border-[#4fd1c5]/20 text-[#4fd1c5]"
      onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
    >
      <span className="text-sm">🌐</span>
      {language}
    </button>
  )
}

