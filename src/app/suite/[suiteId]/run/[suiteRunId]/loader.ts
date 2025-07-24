'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import { suiteRun } from '@/lib/db/schema'

export async function loader({ suiteRunId }: { suiteRunId: number }) {
  const run = await db.query.suiteRun.findFirst({
    where: eq(suiteRun.id, suiteRunId),
    with: {
      suite: true,
      testRuns: {
        with: {
          test: true,
        },
      },
    },
  })

  return run
}

export type TSuiteRun = NonNullable<Awaited<ReturnType<typeof loader>>>
