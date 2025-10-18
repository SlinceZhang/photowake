This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## API helpers

PhotoWake standardizes HTTP calls through a shared axios instance and an [`ahooks`](https://ahooks.js.org/) based hook so that data fetching behaves consistently across pages.

### `lib/http`

- `lib/http.ts` exports a typed axios client with interceptors that:
  - pin `baseURL` to `/api` and forward cookies/credentials for SSR safety,
  - coerce every response into the `{ success, data, error }` shape, and
  - unwrap network failures into a single `ApiResponse` error payload.

```ts
import http from '@/lib/http'

const response = await http.get<User[]>('/users')
if (response.success) {
  // response.data is your payload
} else {
  console.error(response.error?.message)
}
```

### `useApi` hook

- `hooks/useApi.ts` wraps `ahooks` `useRequest` with sensible defaults (`loadingDelay`, `retryCount`, `retryInterval`).
- The hook returns the unwrapped payload in `data`, the raw `ApiResponse` in `response`, a normalized `error`, and helpers like `setData`/`withOptimisticUpdate` for optimistic UI flows.

```tsx
'use client'

import { EmptyState, ErrorState, LoadingState } from '@/app/components/ui/data-state'
import { useApi } from '@/hooks/useApi'
import { getServerGreeting } from '@/app/api'

export function ApiStatus() {
  const { data, loading, error, withOptimisticUpdate, refresh } = useApi(
    () => getServerGreeting(),
    { cacheKey: 'server-greeting' }
  )

  if (loading) {
    return <LoadingState title='API status' description='Checking connectivity…' />
  }

  if (error) {
    return (
      <ErrorState
        title='API status'
        description={error.error?.message}
        onRetry={refresh}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title='API status'
        description='No response yet'
        onAction={refresh}
      />
    )
  }

  return (
    <button
      type='button'
      onClick={() =>
        withOptimisticUpdate(() => data.toUpperCase(), refresh)
      }
      className='rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white'
    >
      {data}
    </button>
  )
}
```

### Shared data states

Use the presentational components in `app/components/ui/data-state.tsx` to keep loading, empty, and error experiences consistent across the product:

- `<LoadingState />` – pending requests with optional messaging
- `<EmptyState />` – no results/empty collections with optional action buttons
- `<ErrorState />` – failures with built-in retry affordances

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
