'use server'

import { asc, eq } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

export async function loader({ suiteRunId }: { suiteRunId: number }) {
  const run = await db.query.suiteRun.findFirst({
    where: eq(schema.suiteRun.id, suiteRunId),
    with: {
      suite: true,
      testRuns: {
        with: {
          test: true,
        },
        orderBy: [asc(schema.testRun.id)],
      },
    },
  })

  return run
}

export type TSuiteRun = NonNullable<Awaited<ReturnType<typeof loader>>>
