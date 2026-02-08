import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rishta.com - Pakistan\'s #1 Trusted Matrimonial App',
  description: 'Pakistan\'s leading AI-powered matrimonial platform with 99% success rate. Find your soulmate in Karachi, Lahore, Islamabad, and across Pakistan.',
  icons: {
    icon: '/images/icons/favicon.svg',
    shortcut: '/images/icons/favicon.svg',
    apple: '/images/icons/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}