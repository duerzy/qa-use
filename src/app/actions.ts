'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod/v4'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { SKYSCANNER_TEST_SUITE } from '@/lib/testing/mock'

const zCreateSuite = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
})

export async function createSuiteAction(form: FormData): Promise<void> {
  const { name, domain } = zCreateSuite.parse({
    name: form.get('name'),
    domain: form.get('domain'),
  })

  // Create the suite
  const [newSuite] = await db
    .insert(schema.suite)
    .values({
      name,
      domain,
    })
    .returning()

  revalidatePath('/')
  redirect(`/suite/${newSuite.id}`)
}

export async function seedSuiteAction() {
  // Insert the suite
  const [insertedSuite] = await db
    .insert(schema.suite)
    .values({ name: SKYSCANNER_TEST_SUITE.label, domain: SKYSCANNER_TEST_SUITE.domain })
    .returning()

  if (!insertedSuite) {
    throw new Error('Failed to insert suite')
  }

  // Insert tests and steps
  for (const test of SKYSCANNER_TEST_SUITE.tests) {
    const [insertedTest] = await db
      .insert(schema.test)
      .values({
        label: test.label,
        task: test.task,
        evaluation: test.evaluation,
        suiteId: insertedSuite.id,
      })
      .returning()

    if (!insertedTest) continue

    // Insert steps for this test
    for (let i = 0; i < test.steps.length; i++) {
      const step = test.steps[i]
      await db.insert(schema.testStep).values({
        testId: insertedTest.id,
        order: i + 1,
        description: typeof step === 'string' ? step : step.description,
      })
    }
  }

  revalidatePath('/')
  redirect(`/`)
}
