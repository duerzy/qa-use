'use server'

import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { client } from '@/lib/api/client'
import { db } from '@/lib/db/db'
import { test } from '@/lib/db/schema'
import { getTaskResponse } from '@/lib/testing/engine'

/**
 * Update the status of a test based on the status of the associated Browser Use task.
 */
export async function updateTestStatus(testId: number, browserUseId: string): Promise<void> {
  try {
    // Get task status from Browser Use API
    const taskResponse = await client.GET('/api/v1/task/{task_id}', {
      params: { path: { task_id: browserUseId } },
    })

    if (taskResponse.error) {
      throw new Error(`Failed to get task status: ${JSON.stringify(taskResponse.error)}`)
    }

    const task = taskResponse.data
    let newStatus: 'pending' | 'running' | 'completed' | 'failed' = 'pending'
    let error: string | null = null

    // Map Browser Use API status to our status
    switch (task.status) {
      case 'created':
        newStatus = 'pending'
        break
      case 'running':
        newStatus = 'running'
        break
      case 'finished':
        // Parse the output to determine if test passed or failed
        const taskResult = getTaskResponse(task.output)
        if (taskResult) {
          newStatus = taskResult.status === 'pass' ? 'completed' : 'failed'
          if (taskResult.status === 'failing') {
            error = taskResult.error
          }
        } else {
          newStatus = 'failed'
          error = 'Failed to parse task output'
        }
        break
      case 'failed':
      case 'stopped':
        newStatus = 'failed'
        error = 'Task failed or was stopped'
        break
      case 'paused':
        newStatus = 'running' // Treat paused as still running
        break
    }

    // Update test in database
    await db
      .update(test)
      .set({
        status: newStatus,
        error,
      })
      .where(eq(test.id, testId))

    revalidatePath('/')
    revalidatePath(`/test/${testId}`)
  } catch (error) {
    console.error(`Error updating test status for test ${testId}:`, error)

    // Mark test as failed due to API error
    await db
      .update(test)
      .set({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred while updating status',
      })
      .where(eq(test.id, testId))

    revalidatePath('/')
    revalidatePath(`/test/${testId}`)
  }
}

/**
 * Get all tests that are running or pending.
 */
export async function getRunningTests(): Promise<{ id: number; browserUseId: string }[]> {
  const tests = await db
    .select({
      id: test.id,
      browserUseId: test.browserUseId,
    })
    .from(test)
    .where(inArray(test.status, ['running', 'pending']))

  return tests
}
