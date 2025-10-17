import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

interface WidgetSelectorProps {
  src: string
  alt: string
  type: string
  selectedPath?: string
  onSelect: (type: string, path: string) => void
  onClear: (type: string) => void
}

export default function WidgetSelector({
  src,
  alt,
  type,
  selectedPath,
  onSelect,
}: WidgetSelectorProps) {
  const prefersReducedMotion = useReducedMotion()
  const isSelected = selectedPath === src

  const hoverAnimation = prefersReducedMotion ? undefined : { scale: 1.05 }
  const tapAnimation = prefersReducedMotion ? undefined : { scale: 0.96 }
  const transition = { duration: 0.12, ease: 'easeOut' as const }

  return (
    <div className='relative group'>
      <motion.button
        type='button'
        onClick={() => onSelect(type, src)}
        whileHover={hoverAnimation}
        whileFocus={hoverAnimation}
        whileTap={tapAnimation}
        transition={transition}
        className={`cursor-pointer rounded-lg p-2 h-20 w-20 flex items-center justify-center ${
          isSelected
            ? 'bg-purple-100 dark:bg-purple-900'
            : 'hover:bg-purple-50 dark:hover:bg-purple-950'
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900`}
      >
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className='h-full w-full object-contain pointer-events-none'
        />
      </motion.button>
    </div>
  )
}
