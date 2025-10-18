'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'
import cn from 'classnames'
import { MoonStar, Sun, Github } from 'lucide-react'
import { useTheme } from 'next-themes'
import { getTest } from '@/app/api/test'
import Image from 'next/image'
import Link from 'next/link'

export default function HeaderBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const handleOpenDropdownHaderBar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // 打开下拉菜单时，禁止滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleResize = () => {
      // tailwind 的 md 断点
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  const handleTest = async () => {
    const data = await getTest()
    console.log(data, 'from backend')
  }

  return (
    <>
      {/* 移动端导航栏 */}
      <div
        className={cn(
          'md:hidden flex h-16 w-full items-center justify-between bg-surface px-4 text-foreground transition-colors',
          isOpen
            ? 'border-b border-border-strong'
            : 'border-b border-transparent'
        )}
      >
        <div className='flex items-center gap-2'>
          <Image
            src='/logo.png'
            alt='Logo'
            priority={true}
            width={40}
            height={40}
            onClick={handleTest}
          />
          <span className='bg-gradient-to-r from-primary to-accent bg-clip-text text-xs font-semibold text-transparent'>
            PhotoWaker
          </span>
        </div>
        <button
          className='flex flex-col group items-center justify-center gap-1 overflow-hidden'
          onClick={handleOpenDropdownHaderBar}
        >
          <span
            className={cn(
              'h-[2px] w-4 bg-foreground transition-transform duration-300 ease-in-out',
              isOpen
                ? 'origin-left translate-x-0 rotate-45'
                : 'group-hover:translate-x-1'
            )}
          ></span>
          <span
            className={cn(
              'h-[2px] w-4 bg-foreground transition-transform duration-300 ease-in-out',
              isOpen
                ? 'translate-x-4'
                : 'translate-x-2 group-hover:translate-x-0'
            )}
          ></span>
          <span
            className={cn(
              'h-[2px] w-4 bg-foreground transition-transform duration-300 ease-in-out',
              isOpen
                ? 'origin-left translate-x-0 -rotate-45'
                : 'group-hover:translate-x-2'
            )}
          ></span>
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      <div
        className={cn(
          'absolute left-0 top-14 h-screen w-full bg-background transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <ul className='mx-auto flex max-w-[288px] flex-col gap-4 p-4 text-foreground'>
          <li className='w-full'>
            <span className='block w-full border-b border-border-muted py-2 text-foreground-secondary'>
              Icon
            </span>
          </li>
          <li className='w-full'>
            <span className='block w-full border-b border-border-muted py-2 text-foreground-secondary'>
              Guide
            </span>
          </li>
          <li className='w-full'>
            <span className='block w-full border-b border-border-muted py-2 text-foreground-secondary'>
              Packages
            </span>
          </li>
          <li className='w-full'>
            <span className='block w-full border-b border-border-muted py-2 text-foreground-secondary'>
              Showcase
            </span>
          </li>
          <li className='w-full'>
            <span className='block w-full border-b border-border-muted py-2 text-foreground-secondary'>
              License
            </span>
          </li>
          <li className='mt-4 flex w-full items-center justify-between rounded-lg border border-border bg-surface-muted px-4 py-4 transition-colors'>
            <p className='text-sm text-foreground-muted'>Appearance</p>
            <button
              type='button'
              role='switch'
              aria-checked={resolvedTheme === 'dark'}
              title='switch appearance'
              className='relative h-6 w-12 rounded-full border border-border bg-surface transition-all duration-300 ease-in-out hover:ring-2 hover:ring-highlight focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight'
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              <span
                className={cn(
                  'absolute left-[1px] top-[0.5px] flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated shadow-sm transition-all duration-300 ease-in-out',
                  resolvedTheme === 'dark'
                    ? 'translate-x-6'
                    : 'translate-x-0'
                )}
              >
                <span className='relative flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated transition-all duration-300'>
                  <Sun className='h-3.5 w-3.5 text-highlight opacity-100 transition-opacity dark:opacity-0' />
                  <MoonStar className='absolute h-3.5 w-3.5 text-foreground-muted opacity-0 transition-opacity dark:opacity-100' />
                </span>
              </span>
            </button>
          </li>
          <li className='flex items-center justify-center'>
            <Link
              href='https://github.com/slince-zero/PhotoWake'
              target='_blank'
              className='text-foreground transition-colors hover:text-primary'
            >
              <Github />
            </Link>
          </li>
        </ul>
      </div>

      {/* PC 导航栏 */}
      <div className='hidden h-16 w-full items-center justify-between bg-surface px-6 text-foreground md:flex'>
        {/* Logo 区域 */}
        <div className='flex items-center gap-2'>
          {resolvedTheme === 'dark' ? (
            <Image
              src='/logo-dark.png'
              alt='Logo'
              width={100}
              height={100}
              style={{ height: 'auto', width: 'auto' }}
            />
          ) : (
            <Image
              src='/logo-white.png'
              alt='Logo'
              width={100}
              height={100}
              style={{ height: 'auto', width: 'auto' }}
            />
          )}
        </div>

        <div className='items-center gap-4 hidden md:flex mr-4'>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </>
  )
}
