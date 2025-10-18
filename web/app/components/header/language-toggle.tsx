'use client'

import { Languages } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Dropdown from './Dropdown'
import { useLanguageStore } from '@/app/store/useLanguageStore'

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const language = useLanguageStore((state) => state.currentLang)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // 点击外部关闭下拉框
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  return (
    <div ref={dropdownRef} className='relative'>
      <button
        type='button'
        className='rounded-full bg-surface px-4 py-2 ring-1 ring-border transition-colors hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight'
        onClick={toggleDropdown}
      >
        <Languages className='text-foreground' />
      </button>
      {isOpen && <Dropdown currentLang={language} />}
    </div>
  )
}
