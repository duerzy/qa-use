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

import { PageHeader } from '../shared/PageHeader'
import { SectionHeader } from '../shared/SectionHeader'
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div className="col-span-1">
          <SectionHeader
            title="Tests"
            actions={[<CreateTestDialog key="create-test-dialog" suiteId={suite.id} createTest={createTest} />]}
          />

          <TestsTab suite={suite} suiteId={suite.id} />
        </div>

        <div className="col-span-1">
          <SectionHeader
            title="History"
            actions={[
              <form key="run-suite-form" action={runSuite}>
                <Button type="submit" variant="outline">
                  <Play className="w-4 h-4" />
                  Run Suite
                </Button>
              </form>,
            ]}
          />
          <HistoryTab suite={suite} />
        </div>
      </div>

      <div className="mt-9" />

      <SectionHeader
        title="Settings"
        actions={[
          <form key="delete-suite-form" action={deleteSuite}>
            <Button type="submit" variant="destructive">
              <Trash /> Delete Suite
            </Button>
          </form>,
        ]}
      />
    </Fragment>
  )
}

function CreateTestDialog({ createTest }: { suiteId: number; createTest: (formData: FormData) => Promise<void> }) {
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

          <div className="flex justify-end gap-2">
            <Button type="submit">Create Test</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
