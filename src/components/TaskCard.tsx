import { useMemo } from 'react'

import type { components } from '@/lib/api/v1'
import { getTaskResponse, TaskResponse } from '@/lib/testing/engine'

import { LivePreview } from './LivePreview'
import { StatusBadge } from './StatusBadge'
import { Badge } from './ui/badge'

function formatDate(date: string): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function TaskCard({ task }: { task: components['schemas']['TaskSimpleResponse'] }) {
  const result = useMemo(() => getTaskResponse(task.output), [task.output])

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm text-gray-900 font-medium flex-1 leading-5 overflow-hidden">
            {task.task.slice(0, 100)}
          </p>
          <StatusBadge status={task.status} />
        </div>

        <div className="text-xs text-gray-500 mb-3">Created: {formatDate(task.created_at)}</div>
      </div>

      <LivePreview liveUrl={task.live_url} taskDescription={task.task} />

      <TaskCardResult result={result} />
    </div>
  )
}

function TaskCardResult({ result }: { result: TaskResponse | null }) {
  if (!result) {
    return (
      <div className="p-4 flex">
        <Badge variant="outline" color="gray">
          No result yet
        </Badge>
      </div>
    )
  }
  if (result.status === 'pass') {
    return (
      <div className="p-4 flex">
        <Badge variant="default">Pass</Badge>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <Badge variant="destructive">Fail</Badge>

      <div className="flex flex-col gap-2">
        {result.steps?.map((step) => (
          <div key={step.id} className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500">{result.error}</p>
    </div>
  )
}
