import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  weight: '100 900',
  variable: '--font-geist-sans',
  display: 'swap',
})

export const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  weight: '100 900',
  variable: '--font-geist-mono',
  display: 'swap',
})
