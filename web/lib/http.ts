import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from 'axios'

export interface ApiErrorPayload {
  message: string
  status?: number
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: ApiErrorPayload | null
}

export type ApiRequestConfig<D = unknown> = AxiosRequestConfig<D>

type AxiosMethodKeys =
  | 'request'
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'

type BaseAxiosInstance = Omit<AxiosInstance, AxiosMethodKeys>

interface ApiHttpInstance extends BaseAxiosInstance {
  <T = unknown, D = unknown>(config: ApiRequestConfig<D>): Promise<ApiResponse<T>>
  request<T = unknown, D = unknown>(
    config: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  get<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  delete<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  head<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  options<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T>>
}

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
}) as ApiHttpInstance

const isApiResponse = (value: unknown): value is ApiResponse<unknown> => {
  if (!value || typeof value !== 'object') return false

  return (
    'success' in value &&
    ('data' in value || 'error' in value)
  )
}

const toErrorPayload = (
  input: unknown,
  status?: number
): ApiErrorPayload => {
  if (!input) {
    return {
      message: 'An unexpected error occurred.',
      status,
    }
  }

  if (typeof input === 'string') {
    return {
      message: input,
      status,
    }
  }

  if (input instanceof Error) {
    return {
      message: input.message,
      status,
      details: input.cause ?? input.stack,
    }
  }

  if (typeof input === 'object') {
    const record = input as Record<string, unknown>
    const message =
      typeof record.message === 'string'
        ? record.message
        : typeof record.error === 'string'
          ? record.error
          : undefined

    return {
      message: message ?? 'An unexpected error occurred.',
      status,
      details:
        'details' in record
          ? record.details
          : Object.keys(record).length > 0
            ? record
            : undefined,
    }
  }

  return {
    message: String(input),
    status,
  }
}

const normalizeSuccess = <T>(
  response: AxiosResponse<T>
): ApiResponse<T> => {
  const payload = response.data as unknown

  if (isApiResponse(payload)) {
    return {
      success: Boolean(payload.success),
      data: (payload.data ?? null) as T | null,
      error: payload.error
        ? toErrorPayload(payload.error, response.status)
        : null,
    }
  }

  return {
    success: true,
    data: (payload ?? null) as T | null,
    error: null,
  }
}

const normalizeError = (error: unknown): ApiResponse<null> => {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const responsePayload = error.response?.data

    if (responsePayload && isApiResponse(responsePayload)) {
      return {
        success: false,
        data: null,
        error: toErrorPayload(
          responsePayload.error ?? error.message,
          status
        ),
      }
    }

    if (error.response?.data) {
      return {
        success: false,
        data: null,
        error: toErrorPayload(error.response.data, status),
      }
    }

    return {
      success: false,
      data: null,
      error: toErrorPayload(error.message, status),
    }
  }

  return {
    success: false,
    data: null,
    error: toErrorPayload(error),
  }
}

http.interceptors.request.use(async (config) => {
  config.withCredentials = true

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : AxiosHeaders.from(config.headers ?? {})

  config.headers = headers

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }
  if (!headers.has('X-Requested-With')) {
    headers.set('X-Requested-With', 'XMLHttpRequest')
  }

  if (typeof window === 'undefined' && !headers.has('Cookie')) {
    try {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const cookieHeader = cookieStore.getAll().length
        ? cookieStore.toString()
        : ''

      if (cookieHeader) {
        headers.set('Cookie', cookieHeader)
      }
    } catch {
      // no-op: cookies are not available outside of a request context
    }
  }

  return config
})

http.interceptors.response.use(
  (response) =>
    normalizeSuccess(response) as unknown as AxiosResponse<ApiResponse<unknown>>,
  (error) => Promise.reject(normalizeError(error))
)

export default http
export type { ApiHttpInstance }
