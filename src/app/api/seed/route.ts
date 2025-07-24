import { NextResponse } from 'next/server'

import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import type { TestDefinition, TestSuiteDefinition } from '@/lib/testing/engine'
import { createTest } from '@/lib/testing/engine'

export const SKYSCANNER_PASSING_SEARCH_TEST: TestDefinition = createTest({
  label: 'Passing Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in Ljubljana as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation:
    'The app should end on the results page showing at least one flight result going from Zurich to Ljubljana',
})

export const SKYSCANNER_FAILING_EVAL_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in Ljubljana as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation: 'The app should end on the results page showing "Wrong date" error.',
})

export const SKYSCANNER_FAILING_TEST_SEARCH_TEST: TestDefinition = createTest({
  label: 'Failing Skyscanner Search',
  task: 'Validate that you can create a new flight search on skyscanner.com',
  steps: [
    'Go to skyscanner.com',
    'Select One-Way Flights',
    'Type in Zurich as departure location.',
    'Type in Ljubljana as destination.',
    'Pick flight date to be tomorrow.',
    'Select one passenger option and click apply',
    'Click search',
  ],
  evaluation: 'The app should end on the results page showing "Wrong date" error.',
})

export const SKYSCANNER_TEST_SUITE: TestSuiteDefinition = {
  label: 'Skyscanner',
  domain: 'skyscanner.com',
  tests: [
    //
    SKYSCANNER_PASSING_SEARCH_TEST,
    SKYSCANNER_FAILING_EVAL_SEARCH_TEST,
    SKYSCANNER_FAILING_TEST_SEARCH_TEST,
  ],
}

export const GET = async () => {
  // Insert the suite
  const [insertedSuite] = await db
    .insert(schema.suite)
    .values({ name: SKYSCANNER_TEST_SUITE.label, domain: SKYSCANNER_TEST_SUITE.domain })
    .returning()

  if (!insertedSuite) {
    return NextResponse.json({ error: 'Failed to insert suite' }, { status: 500 })
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

  return NextResponse.json({ success: true, suiteId: insertedSuite.id })
}
