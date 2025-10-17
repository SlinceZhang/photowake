'use client'

import { ReactNode, useContext, useMemo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { AppContext } from '@/app/providers'

interface PageTransitionProps {
  children: ReactNode
  duration?: number
}

export function PageTransition({ children, duration = 0.18 }: PageTransitionProps) {
  const pathname = usePathname()
  const { previousPathname } = useContext(AppContext)
  const prefersReducedMotion = useReducedMotion()

  const safeDuration = Math.min(Math.max(duration, 0), 0.2)

  const transitionKey = useMemo(() => {
    if (!pathname) {
      return previousPathname ?? 'initial'
    }

    return previousPathname ? `${previousPathname}->${pathname}` : pathname
  }, [pathname, previousPathname])

  const initialVariant = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 12 }
  const exitVariant = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: -12 }
  const transition = prefersReducedMotion
    ? { duration: 0.001 }
    : { duration: safeDuration, ease: 'easeOut' as const }

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.div
        key={transitionKey}
        initial={initialVariant}
        animate={{ opacity: 1, y: 0 }}
        exit={exitVariant}
        transition={transition}
        className='h-full'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
