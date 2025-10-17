import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      intent: {
        primary:
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm hover:from-purple-500 hover:to-pink-500',
        secondary:
          'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
        outline:
          'border border-zinc-300 text-zinc-800 hover:bg-zinc-100/70 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/80',
        ghost: 'text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800/80',
        tint:
          'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-800/50',
        link: 'text-purple-600 underline-offset-4 hover:underline dark:text-purple-400',
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-5 py-2.5 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ intent, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
