import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const suite = pgTable('suite', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const testStatus = pgEnum('test_status', ['pending', 'running', 'completed', 'failed'])

/**
 * A table containing information about all test runs.
 */
export const test = pgTable('test', {
  id: serial('id').primaryKey(),

  label: text('label').notNull(),
  task: text('task').notNull(),
  evaluation: text('evaluation').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),

  status: testStatus('status').notNull(),

  /**
   * The ID of the suite this test belongs to.
   */
  suiteId: integer('suite_id')
    .references(() => suite.id)
    .notNull(),

  error: text('error'),

  /**
   * The ID of the executing instance.
   */
  browserUseId: text('browser_use_id').notNull(),
})

export const testStep = pgTable('test_step', {
  id: serial('id').primaryKey(),

  testId: integer('test_id').references(() => test.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  /**
   * The order of the step in the test.
   */
  order: integer('order').notNull(),

  /**
   * The description of the step.
   */
  description: text('description').notNull(),
})
