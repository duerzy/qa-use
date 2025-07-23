'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'

export function RunSuiteButton({ onRunSuite }: { onRunSuite: () => Promise<{ suiteId: number } | { error: string }> }) {
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRunSuite = useCallback(async () => {
    try {
      setIsRunning(true)
      setError(null)

      const result = await onRunSuite()

      if ('error' in result) {
        setError(result.error)
        return
      }

      // Refresh the page to show the new suite
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run suite')
    } finally {
      setIsRunning(false)
    }
  }, [onRunSuite, router])

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleRunSuite}
        disabled={isRunning}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isRunning ? 'Running Suite...' : 'Run Suite'}
      </Button>
      {error && <p className="text-red-600 text-xs max-w-xs text-right">{error}</p>}
    </div>
  )
}
