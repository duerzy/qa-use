import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core'

export const suite = pgTable('suite', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  /**
   * The domain of the application under test.
   */
  domain: text('domain').notNull(),
})

export const suiteRelations = relations(suite, ({ many }) => ({
  tests: many(test),
  runs: many(suiteRun),
}))

/**
 * A table containing information about all test runs.
 */
export const test = pgTable('test', {
  id: serial('id').primaryKey(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  label: text('label').notNull(),
  evaluation: text('evaluation').notNull(),

  /**
   * The ID of the suite this test belongs to.
   */
  suiteId: integer('suite_id')
    .references(() => suite.id, { onDelete: 'cascade' })
    .notNull(),
})

export const testRelations = relations(test, ({ one, many }) => ({
  suite: one(suite, {
    fields: [test.suiteId],
    references: [suite.id],
  }),
  steps: many(testStep),
  runs: many(testRun),
}))

export const testStep = pgTable('test_step', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  testId: integer('test_id')
    .references(() => test.id, { onDelete: 'cascade' })
    .notNull(),

  /**
   * The order of the step in the test.
   */
  order: integer('order').notNull(),

  /**
   * The description of the step.
   */
  description: text('description').notNull(),
})

export const testStepRelations = relations(testStep, ({ one }) => ({
  test: one(test, {
    fields: [testStep.testId],
    references: [test.id],
  }),
}))

// Runs

export const runStatus = pgEnum('run_status', [
  //
  'pending',
  'running',
  'passed',
  'failed',
])

export type TRunStatus = (typeof runStatus.enumValues)[number]

export const suiteRun = pgTable('suite_run', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  /**
   * The time the run started.
   */
  startedAt: timestamp('started_at').defaultNow(),

  /**
   * The time the run finished.
   */
  finishedAt: timestamp('finished_at'),

  suiteId: integer('suite_id')
    .references(() => suite.id, { onDelete: 'cascade' })
    .notNull(),

  status: runStatus('status').notNull(),
})

export const suiteRunRelations = relations(suiteRun, ({ one, many }) => ({
  suite: one(suite, {
    fields: [suiteRun.suiteId],
    references: [suite.id],
  }),
  testRuns: many(testRun),
}))

export const testRun = pgTable('test_run', {
  id: serial('id').primaryKey(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  /**
   * The time the run started.
   */
  startedAt: timestamp('started_at').defaultNow(),

  /**
   * The time the run finished.
   */
  finishedAt: timestamp('finished_at'),

  /**
   * The ID of the test this run belongs to.
   */
  testId: integer('test_id')
    .references(() => test.id, { onDelete: 'cascade' })
    .notNull(),

  /**
   * The ID of the suite run this test run belongs to.
   */
  suiteRunId: integer('suite_run_id').references(() => suiteRun.id, { onDelete: 'cascade' }),
  status: runStatus('status').notNull(),

  error: text('error'),

  /**
   * The ID of the executing instance.
   */
  browserUseId: text('browser_use_id'),

  /**
   * The URL of the live recording.
   */
  liveUrl: text('live_url'),

  /**
   * The URL of the public share.
   */
  publicShareUrl: text('public_share_url'),
})

export const testRunRelations = relations(testRun, ({ one, many }) => ({
  test: one(test, {
    fields: [testRun.testId],
    references: [test.id],
  }),

  suiteRun: one(suiteRun, {
    fields: [testRun.suiteRunId],
    references: [suiteRun.id],
  }),

  testRunSteps: many(testRunStep),
}))

export const testRunStep = pgTable(
  'test_run_step',
  {
    id: serial('id').primaryKey(),

    testRunId: integer('test_run_id')
      .references(() => testRun.id, { onDelete: 'cascade' })
      .notNull(),

    stepId: integer('step_id')
      .references(() => testStep.id, { onDelete: 'cascade' })
      .notNull(),

    status: runStatus('status').notNull(),
  },
  (table) => {
    return [unique('test_run_step_unique').on(table.testRunId, table.stepId)]
  },
)

export const testRunStepRelations = relations(testRunStep, ({ one }) => ({
  testRun: one(testRun, {
    fields: [testRunStep.testRunId],
    references: [testRun.id],
  }),
  testStep: one(testStep, {
    fields: [testRunStep.stepId],
    references: [testStep.id],
  }),
}))
