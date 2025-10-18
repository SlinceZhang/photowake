'use client'

import { useTheme } from 'next-themes'
import { MoonStar, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      className='rounded-full bg-surface px-4 py-2 ring-1 ring-border transition-colors hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='text-foreground' />
      ) : (
        <MoonStar className='text-foreground' />
      )}
    </button>
  )
}
