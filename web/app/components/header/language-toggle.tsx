'use client'

import { Button } from '@/app/components/ui/button'
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
      <Button
        type='button'
        intent='outline'
        size='icon'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-label='Toggle language menu'
        className='rounded-full'
        onClick={toggleDropdown}
      >
        <Languages className='h-5 w-5' />
      </Button>
      {isOpen && <Dropdown currentLang={language} />}
    </div>
  )
}
