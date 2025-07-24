import { eq, inArray } from 'drizzle-orm'
import { NonRetriableError, RetryAfterError } from 'inngest'

import { client } from '../api/client'
import { db } from '../db/db'
import * as schema from '../db/schema'
import type { TestDefinition } from '../testing/engine'
import { getTaskPrompt, getTaskResponse, RESPONSE_JSON_SCHEMA } from '../testing/engine'
import { ExhaustiveSwitchCheck } from '../types'
import { inngest } from './client'

/**
 * Utility function to test the Inngest connection.
 */
export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
  },
  { event: 'hello' },
  async ({ step, event }) => {
    await step.run('hello', async () => {
      if (event.data.name) {
        return `Hello, ${event.data.name}!`
      }

      return 'Hello, world!'
    })
  },
)

/**
 * Runs a test suite.
 */
export const runTestSuite = inngest.createFunction(
  {
    id: 'run-test-suite',
    onFailure: async ({ event, step }) => {
      const suiteRunId = event.data.event.data.suiteRunId

      await step.run('update-suite-run-status', async () => {
        await db.update(schema.suiteRun).set({ status: 'failed' }).where(eq(schema.suiteRun.id, suiteRunId))
      })
    },
  },
  { event: 'test-suite/run' },
  async ({ step, event }) => {
    const testRunIds = await step.run('get-test-run-ids', async () => {
      const dbTestRuns = await db.query.testRun.findMany({
        where: eq(schema.testRun.suiteRunId, event.data.suiteRunId),
        columns: {
          id: true,
        },
      })

      return dbTestRuns.map((testRun) => testRun.id)
    })

    const dbTestsRuns = await Promise.all(
      testRunIds.map((testRunId) => step.run(`start-test-run-${testRunId}`, _startTestRun, { testRunId })),
    )

    const timeouts = dbTestsRuns.map((testRunId) =>
      step.run(`complete-test-run-${testRunId}`, _pollTaskUntilFinished, { testRunId }),
    )

    await Promise.all(timeouts)

    await step.run(`finalize-suite-run`, _finalizeSuiteRun, { suiteId: event.data.suiteRunId, testRunIds })
  },
)

/**
 * Start a new agent test run and return the ID of the test run.
 */
async function _startTestRun({ testRunId }: { testRunId: number }): Promise<number> {
  const dbTestRun = await db.query.testRun.findFirst({
    where: eq(schema.testRun.id, testRunId),
    with: {
      test: {
        with: {
          suite: true,
          steps: true,
        },
      },
    },
  })

  if (dbTestRun?.browserUseId != null) {
    return dbTestRun.id
  }

  if (!dbTestRun) {
    throw new NonRetriableError(`Test run not found: ${testRunId}`)
  }

  const definition: TestDefinition = {
    evaluation: dbTestRun.test.evaluation,
    label: dbTestRun.test.label,
    steps: dbTestRun.test.steps,
    task: dbTestRun.test.task,
  }

  // Start browser task
  const buTaskResponse = await client.POST('/api/v1/run-task', {
    body: {
      highlight_elements: false,
      enable_public_share: true,
      save_browser_data: false,
      task: getTaskPrompt(definition),
      llm_model: 'gpt-4o-mini',
      use_adblock: true,
      use_proxy: true,
      max_agent_steps: 10,
      // allowed_domains: [dbTestRun.test.suite.domain],
      structured_output_json: JSON.stringify(RESPONSE_JSON_SCHEMA),
    },
  })

  if (!buTaskResponse.data) {
    throw new RetryAfterError('Failed to start browser task', 1_000)
  }

  await db
    .update(schema.testRun)
    .set({
      status: 'running',
      browserUseId: buTaskResponse.data.id,
    })
    .where(eq(schema.testRun.id, dbTestRun.id))

  return dbTestRun.id
}

/**
 * Polls the Browser Use API until the task is finished.
 */
async function _pollTaskUntilFinished({ testRunId }: { testRunId: number }) {
  while (true) {
    const dbTestRun = await db.query.testRun.findFirst({
      where: eq(schema.testRun.id, testRunId),
      with: {
        testRunSteps: true,
      },
    })

    if (!dbTestRun) {
      throw new NonRetriableError(`Test run not found: ${testRunId}`)
    }

    if (!dbTestRun.browserUseId) {
      throw new NonRetriableError(`Test run not started: ${testRunId}`)
    }

    const buTaskResponse = await client.GET('/api/v1/task/{task_id}', {
      params: { path: { task_id: dbTestRun.browserUseId } },
    })

    if (buTaskResponse.error || !buTaskResponse.data) {
      throw new RetryAfterError('Failed to get task status, retrying...', 1_000)
    }

    switch (buTaskResponse.data.status) {
      case 'finished': {
        const taskResult = getTaskResponse(buTaskResponse.data.output)

        if (taskResult.status === 'pass') {
          await db.transaction(async (tx) => {
            await tx
              .update(schema.testRun)
              .set({
                status: 'passed',
                error: null,
                publicShareUrl: buTaskResponse.data.public_share_url,
                liveUrl: buTaskResponse.data.live_url,
              })
              .where(eq(schema.testRun.id, dbTestRun.id))

            await tx
              .update(schema.testRunStep)
              .set({
                status: 'passed' as const,
              })
              .where(eq(schema.testRunStep.testRunId, dbTestRun.id))
          })
        }

        if (taskResult.status === 'failing') {
          await db.transaction(async (tx) => {
            await tx
              .update(schema.testRun)
              .set({
                status: 'failed',
                error: taskResult.error,
                publicShareUrl: buTaskResponse.data.public_share_url,
                liveUrl: buTaskResponse.data.live_url,
              })
              .where(eq(schema.testRun.id, dbTestRun.id))

            for (const step of dbTestRun.testRunSteps) {
              const passed = taskResult.steps?.find((s) => s.id === step.stepId)

              await tx
                .update(schema.testRunStep)
                .set({
                  status: passed ? 'passed' : 'failed',
                })
                .where(eq(schema.testRunStep.testRunId, dbTestRun.id))
            }
          })
        }

        return { ok: true }
      }

      case 'running':
      case 'created': {
        if (buTaskResponse.data.live_url) {
          await db
            .update(schema.testRun)
            .set({
              liveUrl: buTaskResponse.data.live_url,
              publicShareUrl: buTaskResponse.data.public_share_url,
            })
            .where(eq(schema.testRun.id, dbTestRun.id))
        }

        await new Promise((resolve) => setTimeout(resolve, 1_000))
        break
      }

      case 'failed':
      case 'paused':
      case 'stopped': {
        await db
          .update(schema.testRun)
          .set({
            status: 'failed',
          })
          .where(eq(schema.testRun.id, dbTestRun.id))

        return {
          ok: false,
        }
      }

      default:
        throw new ExhaustiveSwitchCheck(buTaskResponse.data.status)
    }
  }
}

async function _finalizeSuiteRun({ suiteId, testRunIds }: { suiteId: number; testRunIds: number[] }) {
  const dbTestRuns = await db.query.testRun.findMany({
    where: inArray(schema.suiteRun.id, testRunIds),
  })

  const hasFailed = dbTestRuns.some((result) => result.status === 'failed')

  await db
    .update(schema.suiteRun)
    .set({ status: hasFailed ? 'failed' : 'passed' })
    .where(eq(schema.suiteRun.id, suiteId))

  return { hasFailed }
}
