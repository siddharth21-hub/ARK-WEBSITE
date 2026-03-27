import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ark — The build behind the idea.',
  description:
    'Ark designs, builds, and maintains complete digital products and intelligent systems for businesses. Systems architecture by Siddharth Shukla.',
  keywords:
    'systems architect, web development, automation, AI integration, Kanpur, India',
  openGraph: {
    title: 'Ark — The build behind the idea.',
    description:
      'Ark designs, builds, and maintains complete digital products and intelligent systems for businesses.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Manrope:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
