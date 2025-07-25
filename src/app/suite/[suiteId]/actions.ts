'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { z } from 'zod/v4'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { inngest } from '@/lib/inngest/client'

export async function runSuiteAction(suiteId: number, _: FormData) {
  // NOTE: First we create a new suite run and all related test runs.

  const suiteRunId = await db.transaction(async (tx) => {
    const suite = await db.query.suite.findFirst({
      where: eq(schema.suite.id, suiteId),
      with: {
        tests: {
          with: {
            steps: true,
          },
        },
      },
    })

    if (!suite) {
      throw new Error(`Suite not found: ${suiteId}`)
    }

    const [newSuiteRun] = await tx
      .insert(schema.suiteRun)
      .values({
        suiteId: suite.id,
        status: 'pending',
      })
      .returning()

    for (const test of suite.tests) {
      // NOTE: We skip test runs with no steps because they won't do anything.
      if (test.steps.length === 0) {
        continue
      }

      const [newTestRun] = await tx
        .insert(schema.testRun)
        .values({
          testId: test.id,
          suiteRunId: newSuiteRun.id,
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
    }

    return newSuiteRun.id
  })

  try {
    await inngest.send({
      name: 'test-suite/run',
      data: {
        suiteRunId,
      },
    })

    revalidatePath(`/suite/${suiteId}`)
  } catch (error) {
    console.error('Failed to trigger suite run:', error)
  }

  redirect(`/suite/${suiteId}/run/${suiteRunId}`, RedirectType.push)
}

const zCreateTest = z.object({
  label: z.string().min(1),
  suiteId: z.number(),
})

export async function createTestAction(suiteId: number, formData: FormData) {
  const data = zCreateTest.parse({
    label: formData.get('label') as string,
    task: formData.get('task') as string,
    suiteId,
  })

  const [newTest] = await db
    .insert(schema.test)
    .values({
      label: data.label,
      evaluation: '',
      suiteId: data.suiteId,
    })
    .returning()

  revalidatePath(`/suite/${suiteId}`)
  redirect(`/suite/${suiteId}/test/${newTest.id}/edit`, RedirectType.push)
}

export async function deleteSuiteAction(suiteId: number) {
  await db.delete(schema.suite).where(eq(schema.suite.id, suiteId))

  revalidatePath('/')
  redirect('/', RedirectType.push)
}
