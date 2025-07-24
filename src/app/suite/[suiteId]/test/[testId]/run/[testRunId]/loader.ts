import { eq } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

export async function loader(suiteId: number, testRunId: number) {
  const testRun = await db.query.testRun.findFirst({
    where: eq(schema.testRun.id, testRunId),
    with: {
      testRunSteps: {
        with: {
          testStep: true,
        },
      },
      test: {
        with: {
          steps: true,
        },
      },
    },
  })

  if (!testRun) {
    return null
  }

  return testRun
}

export type TTestRun = NonNullable<Awaited<ReturnType<typeof loader>>>
