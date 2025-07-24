import { eq } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

export async function loader(testId: number) {
  const test = await db.query.test.findFirst({
    where: eq(schema.test.id, testId),
    with: {
      steps: true,
      runs: true,
    },
  })

  return test
}
