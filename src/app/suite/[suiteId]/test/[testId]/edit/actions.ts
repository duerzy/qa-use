'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import type { State } from '@/components/test/TestEditor'
import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { ExhaustiveSwitchCheck } from '@/lib/types'

export async function saveTest(id: number, test: State, _: FormData): Promise<void> {
  const { label, evaluation, steps } = test

  const dbTest = await db.query.test.findFirst({
    where: eq(schema.test.id, id),
  })

  if (!dbTest) {
    throw new Error(`Test not found: ${id}!`)
  }

  await db
    .update(schema.test)
    .set({
      label,
      evaluation,
    })
    .where(eq(schema.test.id, id))

  let order = 1

  for (const step of steps) {
    switch (step.status) {
      case 'new': {
        await db.insert(schema.testStep).values({
          testId: id,
          description: step.description,
          order: order,
        })

        order++
        break
      }

      case 'existing': {
        if (step.deleted) {
          await db.delete(schema.testStep).where(eq(schema.testStep.id, step.sourceId))

          // NOTE: We don't need to update the order because the order is not used for deleted steps.
          break
        } else {
          await db
            .update(schema.testStep)
            .set({
              description: step.description,
              order,
            })
            .where(eq(schema.testStep.id, step.sourceId))

          order++
        }
        break
      }

      default:
        throw new ExhaustiveSwitchCheck(step)
    }
  }

  redirect(`/suite/${dbTest.suiteId}/test/${dbTest.id}`)
}
