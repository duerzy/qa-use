import { Plus } from 'lucide-react'
import { Suspense } from 'react'

import { SuiteList } from '@/components/SuiteList'
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

import { createSuiteAction, seedSuiteAction } from './actions'
import { loader } from './loader'

export default async function Page() {
  const suites = await loader()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mr-auto">QA-Use</h1>

          <CreateSuiteDialog />

          <form action={seedSuiteAction}>
            <Button variant="outline" type="submit">
              Seed
            </Button>
          </form>
        </div>

        {/* Suites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Suites</h2>
          <Suspense fallback={<div className="text-gray-500">Loading suites...</div>}>
            <SuiteList data={suites} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CreateSuiteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Plus className="w-4 h-4" />
          Create Suite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new test suite</DialogTitle>
          <DialogDescription>A test suite is a collection of tests that you can run together.</DialogDescription>

          <form action={createSuiteAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Suite Name
              </label>
              <Input id="name" name="name" type="text" placeholder="e.g., Login functionality test" required />
            </div>

            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <Input id="domain" name="domain" type="text" placeholder="e.g., example.com" required />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
