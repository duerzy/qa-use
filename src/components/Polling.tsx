'use client'

import { useCallback, useEffect } from 'react'

function useTaskPolling() {
  const pollRunningTests = useCallback(async () => {
    try {
    } catch (error) {
      console.error('Error polling running tests:', error)
    }
  }, [])

  useEffect(() => {
    // Poll immediately on mount
    pollRunningTests()

    // Set up polling interval
    const interval = setInterval(pollRunningTests, 2000) // 2 seconds

    return () => clearInterval(interval)
  }, [pollRunningTests])

  return { pollRunningTests }
}

/**
 * Polls for running tests and updates their status.
 */
export function Polling() {
  useTaskPolling()

  return null
}
