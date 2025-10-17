import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/app/utils/cn'

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/80',
  {
    variants: {
      intent: {
        default: '',
        muted: 'bg-zinc-100 dark:bg-zinc-800/60',
        primary:
          'bg-gradient-to-r from-purple-200 via-zinc-200 to-pink-200 dark:from-purple-900/40 dark:via-zinc-800 dark:to-pink-900/40',
      },
      size: {
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-10',
        xl: 'h-16',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'md',
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, intent, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ intent, size }), className)}
      {...props}
    />
  )
)

Skeleton.displayName = 'Skeleton'

export { skeletonVariants }
