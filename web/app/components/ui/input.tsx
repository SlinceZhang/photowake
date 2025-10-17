import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/utils/cn'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-white/95 text-base text-zinc-900 transition-colors placeholder:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500',
  {
    variants: {
      intent: {
        default: 'border-zinc-300 dark:border-zinc-700',
        subtle: 'border-transparent bg-zinc-100/80 dark:bg-zinc-800/70',
        danger:
          'border-red-500 focus-visible:outline-red-500 dark:border-red-500 dark:focus-visible:outline-red-500',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, intent, size, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ intent, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { inputVariants }
