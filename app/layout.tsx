import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

const siteConfig = {
  name: 'MemexHQ',
  description: 'Every meeting, commit, sales call, and decision — unified into a single context layer that makes every AI agent in your stack dramatically smarter.',
  url: 'https://memexhq.dev',
  ogImage: '/og-default.png',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'MemexHQ — Your AI finally knows your business.',
    template: '%s | MemexHQ',
  },
  description: siteConfig.description,
  keywords: [
    'AI context',
    'enterprise AI',
    'Claude Code',
    'ChatGPT',
    'institutional memory',
    'RAG',
    'vector database',
    'AI agents',
    'context layer',
  ],
  authors: [{ name: 'MemexHQ' }],
  creator: 'MemexHQ',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'MemexHQ — Your AI finally knows your business.',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'MemexHQ - AI Context Layer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemexHQ — Your AI finally knows your business.',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@dariussingh10',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/components/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,200;1,9..144,300;1,9..144,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'MemexHQ',
              url: 'https://memexhq.dev',
              logo: 'https://memexhq.dev/components/logo-dark.svg',
              description: 'AI context layer for enterprise teams',
              sameAs: [
                'https://twitter.com/dariussingh10',
                'https://github.com/memexhq',
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_VERCEL_URL && <Analytics />}
      </body>
    </html>
  )
}
