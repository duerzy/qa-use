import { EventSchemas, Inngest } from 'inngest'

export type HelloEvent = {
  data: {
    name?: string
  }
}

export type RunTestSuiteEvent = {
  data: {
    suiteRunId: number
  }
}

type Events = {
  hello: HelloEvent
  'test-suite/run': RunTestSuiteEvent
}

export const inngest = new Inngest({
  id: 'qa-use',
  schemas: new EventSchemas().fromRecord<Events>(),
})
