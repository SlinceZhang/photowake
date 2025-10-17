import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/utils/cn'

const cardVariants = cva(
  'rounded-2xl border bg-white text-zinc-900 shadow-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
  {
    variants: {
      intent: {
        surface: 'hover:shadow-md',
        outline:
          'border-2 border-purple-200 dark:border-purple-800/60 hover:shadow-lg',
        muted:
          'bg-zinc-50/80 text-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 border-transparent',
        ghost:
          'border-transparent shadow-none bg-transparent dark:bg-transparent text-inherit',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      intent: 'surface',
      size: 'md',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, intent, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ intent, size }), className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold tracking-tight text-xl', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-zinc-600 dark:text-zinc-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center justify-between', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { cardVariants }
