'use client'

import { Input } from '@/components/ui/input'
import { useAPI } from '@/hooks/useAPI'

export function ApiKeyInput() {
  const { apiKey, setApiKey } = useAPI()

  return (
    <div className="w-full max-w-md">
      <Input
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
