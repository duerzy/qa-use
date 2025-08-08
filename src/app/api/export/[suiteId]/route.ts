import { eq } from 'drizzle-orm'

import type { TImportSuiteFile } from '@/app/types'
import { zImportSuiteFileSchema } from '@/app/types'
import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

// https://nextjs.org/docs/app/api-reference/file-conventions/route
export async function GET(request: Request, { params }: { params: Promise<{ suiteId: string }> }) {
  const { suiteId } = await params

  const suiteIdNum = parseInt(suiteId, 10)
  if (isNaN(suiteIdNum)) {
    throw new Error(`Invalid suite ID: ${suiteId}`)
  }

  const suite = await db.query.suite.findFirst({
    where: eq(schema.suite.id, suiteIdNum),
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

  // NOTE: We use this to check the type of the suite.
  const json: TImportSuiteFile = suite

  // Assuming you have a Zod schema for the suite export, e.g. import { suiteExportSchema } from '@/lib/validation/suiteExportSchema'
  // You can use .parse() or .safeParse() to filter out unwanted fields.
  // This will strip out fields not defined in the Zod schema (e.g. id, createdAt).

  const filtered = zImportSuiteFileSchema.parse(json)
  const raw = JSON.stringify(filtered, null, 2)

  const blob = new Blob([raw], { type: 'application/json' })

  return new Response(blob, {
    headers: {
      'Content-Disposition': `attachment; filename="${suite.name}.json"`,
      'Content-Type': 'application/json',
    },
  })
}
