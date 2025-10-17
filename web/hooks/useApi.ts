import { useCallback } from 'react'
import { useRequest } from 'ahooks'
import type { Options, Result } from 'ahooks/lib/useRequest/src/types'
import type { ApiResponse } from '@/lib/http'

type DataUpdater<T> = T | ((previous: T | undefined) => T)

type BaseRequestResult<TData, TParams extends any[]> = Result<
  ApiResponse<TData>,
  TParams
>

export interface UseApiOptions<TData, TParams extends any[]>
  extends Options<ApiResponse<TData>, TParams> {
  cacheKey?: string
  loadingDelay?: number
  retryCount?: number
  retryInterval?: number
}

export interface UseApiResult<TData, TParams extends any[]>
  extends Omit<BaseRequestResult<TData, TParams>, 'data' | 'error'> {
  response: ApiResponse<TData> | undefined
  data: TData | null
  error: ApiResponse<null> | undefined
  isSuccess: boolean
  setData: (updater: DataUpdater<TData | null>) => void
  withOptimisticUpdate: <TReturn>(
    updater: DataUpdater<TData | null>,
    action: () => Promise<TReturn>
  ) => Promise<TReturn>
}

const resolveUpdater = <T>(
  updater: DataUpdater<T>,
  previous: T | undefined
): T => {
  return typeof updater === 'function'
    ? (updater as (prev: T | undefined) => T)(previous)
    : updater
}

export function useApi<TData, TParams extends any[] = []>(
  service: (...args: TParams) => Promise<ApiResponse<TData>>,
  options: UseApiOptions<TData, TParams> = {}
): UseApiResult<TData, TParams> {
  const {
    cacheKey,
    loadingDelay = 200,
    retryCount = 1,
    retryInterval = 1000,
    ...restOptions
  } = options

  const derivedCacheKey =
    cacheKey !== undefined ? cacheKey : service.name || undefined

  const request = useRequest(service, {
    cacheKey: derivedCacheKey,
    loadingDelay,
    retryCount,
    retryInterval,
    ...restOptions,
  })

  const setData = useCallback(
    (updater: DataUpdater<TData | null>) => {
      request.mutate((previous) => {
        const nextData = resolveUpdater<TData | null>(
          updater,
          previous?.data ?? undefined
        )

        return {
          success: previous?.success ?? true,
          data: (nextData ?? null) as TData | null,
          error: previous?.error ?? null,
        }
      })
    },
    [request]
  )

  const withOptimisticUpdate = useCallback(
    async <TReturn>(
      updater: DataUpdater<TData | null>,
      action: () => Promise<TReturn>
    ) => {
      const snapshot = request.data

      request.mutate((previous) => ({
        success: true,
        data: resolveUpdater<TData | null>(
          updater,
          previous?.data ?? undefined
        ),
        error: null,
      }))

      try {
        const result = await action()
        return result
      } catch (error) {
        if (snapshot) {
          request.mutate(snapshot)
        }
        throw error
      }
    },
    [request]
  )

  const { data: response, error, mutate, ...rest } = request

  return {
    ...rest,
    response,
    data: response?.data ?? null,
    error: error as ApiResponse<null> | undefined,
    isSuccess: Boolean(response?.success),
    mutate,
    setData,
    withOptimisticUpdate,
  }
}
