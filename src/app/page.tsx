import { desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { Suspense } from 'react'

import { Polling } from '@/components/Polling'
import { RunSuiteButton } from '@/components/RunSuiteButton'
import { SuiteList } from '@/components/SuiteList'
import { client } from '@/lib/api/client'
import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'
import { getTaskPrompt, RESPONSE_JSON_SCHEMA, TestSuiteDefinition } from '@/lib/testing/engine'
import { SKYSCANNER_TEST_SUITE } from '@/lib/testing/mock'

async function loader() {
  'use server'

  const suites = await db.query.suite.findMany({
    orderBy: [desc(schema.suite.createdAt)],
    with: {
      tests: {
        orderBy: [desc(schema.test.createdAt)],
        with: {
          steps: {
            orderBy: [desc(schema.testStep.order)],
          },
        },
      },
    },
  })

  return suites
}

export type TPageData = Awaited<ReturnType<typeof loader>>

async function action(): Promise<{ suiteId: number } | { error: string }> {
  'use server'

  const suite: TestSuiteDefinition = SKYSCANNER_TEST_SUITE

  try {
    // Create the suite
    const [newSuite] = await db
      .insert(schema.suite)
      .values({
        name: suite.label,
      })
      .returning()

    if (!newSuite) {
      return { error: 'Failed to create suite' }
    }

    // Create tests and start browser tasks
    for (const testDef of suite.tests) {
      // Start browser task
      const taskResponse = await client.POST('/api/v1/run-task', {
        body: {
          highlight_elements: false,
          enable_public_share: false,
          save_browser_data: false,
          task: getTaskPrompt(testDef),
          llm_model: 'gpt-4o-mini',
          use_adblock: true,
          use_proxy: true,
          max_agent_steps: 10,
          structured_output_json: JSON.stringify(RESPONSE_JSON_SCHEMA),
        },
      })

      if (taskResponse.error) {
        throw new Error(`Failed to start browser task: ${taskResponse.error}`)
      }

      const browserUseId = taskResponse.data.id

      // Create test in database
      const [newTest] = await db
        .insert(schema.test)
        .values({
          label: testDef.label,
          task: testDef.task,
          evaluation: testDef.evaluation,
          status: 'pending',
          suiteId: newSuite.id,
          browserUseId,
        })
        .returning()

      if (!newTest) {
        throw new Error('Failed to create test')
      }

      // Create test steps
      for (const step of testDef.steps) {
        await db.insert(schema.testStep).values({
          testId: newTest.id,
          order: step.id,
          description: step.description,
        })
      }
    }

    revalidatePath('/')

    return { suiteId: newSuite.id }
  } catch (error) {
    console.error('Error creating suite with tests:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

export default async function Page() {
  const suites = await loader()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QA-Use</h1>
          <RunSuiteButton onRunSuite={action} />
        </div>

        {/* Suites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Suites</h2>
          <Suspense fallback={<div className="text-gray-500">Loading suites...</div>}>
            <SuiteList data={suites} />
          </Suspense>
        </div>

        <Polling />
      </div>
    </div>
  )
}
