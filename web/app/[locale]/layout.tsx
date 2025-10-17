import type { Metadata } from 'next'
import '@/app/globals.css'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { Providers } from '../providers'
import { inter } from '../utils/font'
import { PageTransition } from '../components/motion/page-transition'

export const metadata: Metadata = {
  title: 'Photo Waker',
  description: 'avator generator',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  const VALID_LOCALES = ['en', 'zh']
  const validLocale = VALID_LOCALES.includes(locale) ? locale : 'en'

  const messages = await getMessages()

  return (
    <html lang={validLocale} className='h-full' suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased h-full bg-white dark:bg-zinc-900`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <PageTransition>{children}</PageTransition>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
