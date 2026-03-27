import ArkApp from '@/components/ArkApp'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Ark',
  description:
    'Systems architecture, web development, and automation by Siddharth Shukla',
  url: 'https://ark-website-kappa.vercel.app',
  founder: {
    '@type': 'Person',
    name: 'Siddharth Shukla',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kanpur',
    addressCountry: 'IN',
  },
  serviceType: [
    'Web Development',
    'Automation Systems',
    'AI Integration',
    'Systems Architecture',
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArkApp />
    </>
  )
}
