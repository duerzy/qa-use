import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

import { HistoryTab } from '../../../components/suite/HistoryTab'
import { TestsTab } from '../../../components/suite/TestsTab'
import { createTestAction, deleteSuiteAction, runSuiteAction } from './actions'
import { loader } from './loader'

export default async function SuitePage({ params }: { params: Promise<{ suiteId: string }> }) {
  const { suiteId } = await params
  const suiteIdNum = parseInt(suiteId, 10)

  if (isNaN(suiteIdNum)) {
    notFound()
  }

  const suite = await loader(suiteIdNum)
  if (!suite) {
    notFound()
  }

  const runSuite = runSuiteAction.bind(null, suiteIdNum)
  const deleteSuite = deleteSuiteAction.bind(null, suiteIdNum)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Suites
          </Link>

          <div className="flex items-start gap-4">
            <div className="mr-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{suite.name}</h1>
              <p className="text-md text-gray-500">{suite.domain}</p>
            </div>

            <form action={runSuite}>
              <Button type="submit">Run Suite</Button>
            </form>

            <form action={deleteSuite}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        </div>

        {/* Body with Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
            </TabsList>

            <CreateTestDialog suiteId={suiteIdNum} />
          </div>

          <TabsContent value="history">
            <HistoryTab suite={suite} />
          </TabsContent>

          <TabsContent value="tests">
            <TestsTab suite={suite} suiteId={suiteIdNum} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CreateTestDialog({ suiteId }: { suiteId: number }) {
  const action = createTestAction.bind(null, suiteId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
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

        <form action={action} className="space-y-4">
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
