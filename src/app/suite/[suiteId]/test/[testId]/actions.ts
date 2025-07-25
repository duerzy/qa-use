'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { inngest } from '@/lib/inngest/client'

export async function runTestAction(testId: number, _: FormData) {
  // NOTE: First we create a new suite run and all related test runs.

  const { test, testRunId } = await db.transaction(async (tx) => {
    const test = await db.query.test.findFirst({
      where: eq(schema.test.id, testId),
      with: {
        steps: true,
        suite: true,
      },
    })

    if (!test) {
      throw new Error(`Test not found: ${testId}`)
    }

    const [newTestRun] = await tx
      .insert(schema.testRun)
      .values({
        testId: test.id,
        status: 'pending',
      })
      .returning()

    for (const step of test.steps) {
      await tx.insert(schema.testRunStep).values({
        testRunId: newTestRun.id,
        stepId: step.id,
        status: 'pending',
      })
    }

    return { test, testRunId: newTestRun.id }
  })

  try {
    await inngest.send({
      name: 'test/run',
      data: {
        testRunId,
      },
    })

    revalidatePath(`/suite/${test.suiteId}/test/${testId}`)
  } catch (error) {
    console.error('Failed to trigger suite run:', error)
  }

  redirect(`/suite/${test.suiteId}/test/${testId}/run/${testRunId}`, RedirectType.push)
}

export async function deleteTestAction(testId: number, _: FormData) {
  const test = await db.query.test.findFirst({
    where: eq(schema.test.id, testId),
    with: {
      suite: true,
    },
  })

  if (!test) {
    throw new Error(`Test not found: ${testId}`)
  }

  await db.delete(schema.test).where(eq(schema.test.id, testId))
  revalidatePath(`/suite/${test.suiteId}`)
  redirect(`/suite/${test.suiteId}`, RedirectType.push)
}
