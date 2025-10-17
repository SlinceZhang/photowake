'use client'

import { useTheme } from 'next-themes'
import { MoonStar, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type='button'
      className='px-4 py-2 rounded-full ring-1 ring-border'
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? <Sun /> : <MoonStar />}
    </button>
  )
}
