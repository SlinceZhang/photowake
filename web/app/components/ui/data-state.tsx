import type { ReactNode } from 'react'
import cn from 'classnames'
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'

interface StateButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'danger'
}

const StateButton = ({ label, onClick, variant = 'primary' }: StateButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    className={cn(
      'rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      variant === 'danger'
        ? 'bg-gradient-to-r from-rose-500 to-red-500 focus-visible:ring-red-500'
        : 'bg-gradient-to-r from-purple-600 to-pink-600 focus-visible:ring-purple-500'
    )}
  >
    {label}
  </button>
)

interface StateCardProps {
  icon: ReactNode
  iconClassName?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const StateCard = ({
  icon,
  iconClassName,
  title,
  description,
  action,
  className,
}: StateCardProps) => (
  <div
    className={cn(
      'flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur transition-colors dark:border-zinc-800 dark:bg-zinc-900/70',
      className
    )}
  >
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full text-lg text-current',
        iconClassName
      )}
    >
      {icon}
    </div>
    <div className='space-y-1'>
      <p className='text-base font-semibold text-gray-900 dark:text-gray-100'>{title}</p>
      {description ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>
      ) : null}
    </div>
    {action ? <div className='mt-2 flex items-center justify-center'>{action}</div> : null}
  </div>
)

export type LoadingStateProps = Omit<
  StateCardProps,
  'icon' | 'iconClassName' | 'action'
>

export const LoadingState = ({
  title = 'Loading',
  description,
  className,
}: LoadingStateProps) => {
  return (
    <StateCard
      icon={<Loader2 className='h-5 w-5 animate-spin' />}
      iconClassName='bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
      title={title}
      description={description}
      className={className}
    />
  )
}

export interface EmptyStateProps
  extends Omit<StateCardProps, 'icon' | 'iconClassName'> {
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({
  title = 'Nothing here yet',
  description,
  className,
  action,
  actionLabel = 'Refresh',
  onAction,
}: EmptyStateProps) => {
  const actionNode = action ?? (onAction ? <StateButton label={actionLabel} onClick={onAction} /> : null)

  return (
    <StateCard
      icon={<Inbox className='h-5 w-5' />}
      iconClassName='bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
      title={title}
      description={description}
      action={actionNode}
      className={className}
    />
  )
}

export interface ErrorStateProps
  extends Omit<StateCardProps, 'icon' | 'iconClassName'> {
  retryLabel?: string
  onRetry?: () => void
}

export const ErrorState = ({
  title = 'Something went wrong',
  description,
  className,
  action,
  retryLabel = 'Try again',
  onRetry,
}: ErrorStateProps) => {
  const actionNode =
    action ?? (onRetry ? <StateButton label={retryLabel} onClick={onRetry} variant='danger' /> : null)

  return (
    <StateCard
      icon={<AlertTriangle className='h-5 w-5' />}
      iconClassName='bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
      title={title}
      description={description}
      action={actionNode}
      className={className}
    />
  )
}
