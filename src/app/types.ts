import { z } from 'zod'

const zImportSuiteStepSchema = z.object({
  description: z.string(),
  order: z.number(),
})

const zImportSuiteTestSchema = z.object({
  label: z.string(),
  evaluation: z.string(),
  steps: zImportSuiteStepSchema.array(),
})

export const zImportSuiteFileSchema = z.object({
  name: z.string(),
  cronCadence: z.enum(['hourly', 'daily']).nullable(),
  notificationsEmailAddress: z.string().nullable(),
  tests: zImportSuiteTestSchema.array(),
})

export type TImportSuiteFile = z.infer<typeof zImportSuiteFileSchema>
