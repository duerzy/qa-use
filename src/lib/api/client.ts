import createClient from 'openapi-fetch'

import type { paths } from '@/lib/api/v1'

export type Client = ReturnType<typeof createClient<paths>>

// 获取环境变量，兼容客户端和服务端
const getBaseUrl = () => {
  // 在客户端，只能访问 NEXT_PUBLIC_ 前缀的环境变量
  if (typeof window !== 'undefined') {
    return 'https://api.browser-use.com/' // 客户端默认使用云端 API
  }
  
  // 在服务端，可以访问所有环境变量
  const env = (globalThis as any).process?.env || {}
  return env.NODE_ENV === 'local' 
    ? 'http://host.docker.internal:8005/'  // 本地 API
    : 'https://api.browser-use.com/'  // 云端 API
}

const getApiKey = () => {
  if (typeof window !== 'undefined') {
    // 客户端只能访问 NEXT_PUBLIC_ 前缀的环境变量
    const env = (globalThis as any).process?.env || {}
    return env.NEXT_PUBLIC_BROWSER_USE_API_KEY || ''
  }
  // 服务端可以访问所有环境变量
  const env = (globalThis as any).process?.env || {}
  return env.BROWSER_USE_API_KEY || ''
}

export const client = createClient<paths>({
  baseUrl: getBaseUrl(),
  headers: { Authorization: `Bearer ${getApiKey()}` },
})