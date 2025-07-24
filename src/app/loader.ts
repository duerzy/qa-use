import { desc } from 'drizzle-orm'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

export async function loader() {
  const suites = await db.query.suite.findMany({
    orderBy: [desc(schema.suite.createdAt)],
  })

  return suites
}

export type TPageData = Awaited<ReturnType<typeof loader>>
