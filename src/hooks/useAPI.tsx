'use client'

import createClient from 'openapi-fetch'
import React, { useContext, useMemo } from 'react'

import { paths } from '@/lib/api/v1'

import { useLocalStorage } from './useLocalStorage'

export type Client = ReturnType<typeof createClient<paths>>

type Context = {
  apiKey: string

  /**
   * Updates the API key.
   */
  setApiKey: (key: string) => void

  client: Client
}

const APIContext = React.createContext<Context | null>(null)

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useLocalStorage('use-qa-api-key', '')

  const client = useMemo(() => {
    const client = createClient<paths>({
      baseUrl: 'https://api.browser-use.com/',
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    return client
  }, [apiKey])

  const context = useMemo(
    () => ({
      apiKey,
      setApiKey,
      client,
    }),
    [apiKey, setApiKey, client],
  )

  return <APIContext.Provider value={context}>{children}</APIContext.Provider>
}

export const useAPI = () => {
  const context = useContext(APIContext)

  if (!context) {
    throw new Error('useAPI must be used within a APIProvider')
  }

  return context
}
