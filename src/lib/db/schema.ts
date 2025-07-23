import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * A table containing information about all test runs.
 */
export const tests = pgTable('tests', {
  id: serial('id').primaryKey(),

  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  browserUseId: text('browser_use_id').notNull(),
})
