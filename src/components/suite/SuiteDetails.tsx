import { Play, Plus, Trash } from 'lucide-react'
import { Fragment } from 'react'

import type { TSuite } from '@/app/suite/[suiteId]/loader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PageHeader } from '../shared/PageHeader'
import { HistoryTab } from './HistoryTab'
import { TestsTab } from './TestsTab'

/**
 * Renders the details of a given suite.
 */
export function SuiteDetails({
  suite,
  runSuite,
  deleteSuite,
  createTest,
}: {
  suite: TSuite
  runSuite: (formData: FormData) => Promise<void>
  deleteSuite: (formData: FormData) => Promise<void>
  createTest: (formData: FormData) => Promise<void>
}) {
  return (
    <Fragment>
      <PageHeader title={suite.name} subtitle={suite.domain} back={{ href: '/', label: 'All Suites' }} />

      {/* Body with Tabs */}
      <Tabs defaultValue="history" className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <CreateTestDialog suiteId={suite.id} createTest={createTest} />

          <form action={runSuite}>
            <Button type="submit">
              <Play className="w-4 h-4" />
              Run Suite
            </Button>
          </form>

          <form action={deleteSuite}>
            <Button type="submit" variant="destructive">
              <Trash />
            </Button>
          </form>
        </div>

        <TabsContent value="history">
          <HistoryTab suite={suite} />
        </TabsContent>

        <TabsContent value="tests">
          <TestsTab suite={suite} suiteId={suite.id} />
        </TabsContent>
      </Tabs>
    </Fragment>
  )
}

function CreateTestDialog({
  suiteId,
  createTest,
}: {
  suiteId: number
  createTest: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="outline">
          <Plus className="w-4 h-4" />
          Create Test
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
          <DialogDescription>
            Add a new test to this suite. Provide a name and description of what should be tested.
          </DialogDescription>
        </DialogHeader>

        <form action={createTest} className="space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Test Name
            </label>
            <Input id="label" name="label" type="text" placeholder="e.g., Login functionality test" required />
          </div>

          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <Input
              id="task"
              name="task"
              type="text"
              placeholder="e.g., Verify user can log in with valid credentials"
              required
            />
          </div>

          <input type="hidden" name="suiteId" value={suiteId} />

          <div className="flex justify-end gap-2">
            <Button type="submit">Create Test</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
