'use client'

import { useCallback, useEffect, useState } from 'react'

import type { components } from '@/lib/api/v1'

import { useAPI } from './useAPI'

type TaskFilter = 'all' | 'running'

const RUNNING_STATUSES: components['schemas']['TaskStatusEnum'][] = ['created', 'running', 'paused']

type UseTasksReturn = {
  tasks: components['schemas']['TaskSimpleResponse'][]
  filteredTasks: components['schemas']['TaskSimpleResponse'][]
  loading: boolean
  error: string | null
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  refetch: () => void
}

export function useTasks(): UseTasksReturn {
  const { client, apiKey } = useAPI()

  const [tasks, setTasks] = useState<components['schemas']['TaskSimpleResponse'][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<TaskFilter>('all')

  const fetchTasks = useCallback(async () => {
    if (!apiKey.trim()) {
      setTasks([])
      setLoading(false)
      setError(null)
      return
    }

    try {
      setError(null)
      const response = await client.GET('/api/v1/tasks', {
        query: {
          limit: 100,
        },
      })

      if (!response.data) {
        throw new Error('Failed to fetch tasks')
      }

      setTasks(response.data.tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [client, apiKey])

  const refetch = useCallback(() => {
    if (apiKey.trim()) {
      setLoading(true)
      fetchTasks()
    }
  }, [fetchTasks, apiKey])

  // Initial fetch when API key changes
  useEffect(() => {
    if (apiKey.trim()) {
      setLoading(true)
      fetchTasks()
    }
  }, [fetchTasks, apiKey])

  // Auto-refresh every 5 seconds for running tasks
  useEffect(() => {
    if (!apiKey.trim()) return

    const hasRunningTasks = tasks.some((task) => RUNNING_STATUSES.includes(task.status))

    if (hasRunningTasks) {
      const interval = setInterval(() => {
        fetchTasks()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [fetchTasks, tasks, apiKey])

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((task) => RUNNING_STATUSES.includes(task.status))

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    refetch,
  }
}
