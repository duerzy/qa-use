'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

export function useTaskPolling({ run, interval = 2000 }: { run: boolean; interval?: number }) {
  const router = useRouter()
  const isRunning = useRef(true)

  const poll = useCallback(async () => {
    if (isRunning.current) {
      router.refresh() // triggers a full fetch/re-render
    }
  }, [router])

  useEffect(() => {
    poll()

    if (!run) {
      isRunning.current = false
      return
    }

    isRunning.current = true

    const id = setInterval(poll, interval)

    return () => {
      isRunning.current = false
      clearInterval(id)
    }
  }, [poll, interval, run])

  return null
}
/**
 * Polls for running tests and updates their status.
 */
export function Polling({ poll }: { poll: boolean }) {
  useTaskPolling({ run: poll })

  return null
}
