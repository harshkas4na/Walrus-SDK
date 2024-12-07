export function Partners() {
  const partners = [
    { name: 'SuiChain', logo: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=040', description: 'Blockchain platform for smart contract integration' },
    { name: 'AI Research Lab', logo: 'https://cryptologos.cc/logos/numeraire-nmr-logo.png?v=040', description: 'Leading AI research institution leveraging our datasets' },
    { name: 'DataVerse', logo: 'https://cryptologos.cc/logos/streamr-data-logo.png?v=040', description: 'Data visualization tools for AI researchers' },
  ]

  return (
    <section className="mb-32">
      <h2 className="text-5xl text-center mb-16 text-[#4fd1c5]">Building on Walrus</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {partners.map((partner) => (
          <div key={partner.name} className="p-8 rounded-xl border border-[#4fd1c5]/20 bg-[#0a0b14]/50 backdrop-blur-sm">
            <img src={partner.logo} alt={partner.name} className="h-12 w-auto mb-4" />
            {partner.description && <p className="text-[#4fd1c5]/60">{partner.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

