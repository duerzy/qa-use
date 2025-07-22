'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAPI } from '@/hooks/useAPI'
import { useMounted } from '@/hooks/useMounted'
import { getTaskPrompt, RESPONSE_JSON_SCHEMA } from '@/lib/testing/engine'
import { SKYSCANNER_FAILING_SEARCH_TEST, SKYSCANNER_PASSING_SEARCH_TEST } from '@/lib/testing/mock'

export function CreateTaskButton({ onTaskCreated }: { onTaskCreated?: () => void }) {
  const { client, apiKey } = useAPI()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useMounted()

  const handleCreateTask = useCallback(async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key first')
      return
    }

    try {
      setCreating(true)
      setError(null)

      await Promise.all([
        client.POST('/api/v1/run-task', {
          body: {
            highlight_elements: false,
            enable_public_share: false,
            save_browser_data: false,
            task: getTaskPrompt(SKYSCANNER_FAILING_SEARCH_TEST),

            llm_model: 'gpt-4.1-mini',
            use_adblock: true,
            use_proxy: true,
            max_agent_steps: 10,
            structured_output_json: JSON.stringify(RESPONSE_JSON_SCHEMA),
          },
        }),
        client.POST('/api/v1/run-task', {
          body: {
            highlight_elements: false,
            enable_public_share: false,
            save_browser_data: false,
            task: getTaskPrompt(SKYSCANNER_PASSING_SEARCH_TEST),

            llm_model: 'gpt-4.1-mini',
            use_adblock: true,
            use_proxy: true,
            max_agent_steps: 10,
            structured_output_json: JSON.stringify(RESPONSE_JSON_SCHEMA),
          },
        }),
      ])

      onTaskCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setCreating(false)
    }
  }, [apiKey, client, onTaskCreated])

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleCreateTask} disabled={creating || !apiKey.trim() || !mounted} className="px-4 py-2">
        {creating ? 'Creating Task...' : 'Create Test Task'}
      </Button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}
