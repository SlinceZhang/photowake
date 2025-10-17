'use client'

import { Button } from '@/app/components/ui/button'
import { useTheme } from 'next-themes'
import { MoonStar, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      type='button'
      intent='outline'
      size='icon'
      aria-label='Toggle theme'
      className='rounded-full'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='h-5 w-5' />
      ) : (
        <MoonStar className='h-5 w-5' />
      )}
    </Button>
  )
}
