import http from '@/lib/http'
import type { ApiResponse } from '@/lib/http'

export const getAllUsers = async (): Promise<ApiResponse<string[]>> => {
  return http.get<string[]>('/users')
}

export const getServerGreeting = async (): Promise<ApiResponse<string>> => {
  return http.get<string>('/')
}
