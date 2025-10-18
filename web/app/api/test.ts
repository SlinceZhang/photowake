import http from '@/lib/http'

export const getTest = () => http.get<string>('/')
