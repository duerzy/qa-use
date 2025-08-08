'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod/v4'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

import { zImportSuiteFileSchema } from './types'

const zCreateSuite = z.object({
  name: z.string().min(1),
})

export async function createSuiteAction(form: FormData): Promise<void> {
  const { name } = zCreateSuite.parse({
    name: form.get('name'),
  })

  // Create the suite
  const [newSuite] = await db
    .insert(schema.suite)
    .values({
      name,
    })
    .returning()

  revalidatePath('/')
  redirect(`/suite/${newSuite.id}`)
}

const MAX_BYTES = 1024 * 1024 * 10 // 10MB

export async function importSuiteAction(form: FormData): Promise<void> {
  const file = form.get('file')
  if (!(file instanceof File)) {
    throw new Error('No file uploaded.')
  }
  if (file.size === 0) {
    throw new Error('File is empty.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File too large. Limit is ${MAX_BYTES} bytes.`)
  }

  let raw: unknown
  try {
    const text = await file.text()
    raw = JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON.')
  }

  const importedSuiteData = zImportSuiteFileSchema.parse(raw)

  const dbImportedSuite = await db.transaction(async (tx) => {
    const [newSuite] = await tx
      .insert(schema.suite)
      .values({
        name: importedSuiteData.name,
        cronCadence: importedSuiteData.cronCadence,
        notificationsEmailAddress: importedSuiteData.notificationsEmailAddress,
      })
      .returning()

    for (const test of importedSuiteData.tests) {
      const [newTest] = await tx
        .insert(schema.test)
        .values({
          evaluation: test.evaluation,
          label: test.label,
          suiteId: newSuite.id,
        })
        .returning()

      for (const step of test.steps) {
        await tx.insert(schema.testStep).values({
          description: step.description,
          order: step.order,
          testId: newTest.id,
        })
      }
    }

    return newSuite
  })

  revalidatePath('/')
  redirect(`/suite/${dbImportedSuite.id}`)
}
