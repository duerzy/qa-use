import { desc } from 'drizzle-orm'
import { Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { z } from 'zod/v4'

import { Polling } from '@/components/Polling'
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
import { db } from '@/lib/db/db'
import * as schema from '@/lib/db/schema'

async function loader() {
  'use server'

  const suites = await db.query.suite.findMany({
    orderBy: [desc(schema.suite.createdAt)],
  })

  return suites
}

export type TPageData = Awaited<ReturnType<typeof loader>>

const zCreateSuite = z.object({
  name: z.string().min(1),
  domain: z.string().min(1),
})

async function action(form: FormData): Promise<void> {
  'use server'

  const { name, domain } = zCreateSuite.parse({
    name: form.get('name'),
    domain: form.get('domain'),
  })

  // Create the suite
  const [newSuite] = await db
    .insert(schema.suite)
    .values({
      name,
      domain,
    })
    .returning()

  revalidatePath('/')
  redirect(`/suite/${newSuite.id}`)
}

export default async function Page() {
  const suites = await loader()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QA-Use</h1>

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

                <form action={action} className="space-y-4">
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
        </div>

        {/* Suites List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Suites</h2>
          <Suspense fallback={<div className="text-gray-500">Loading suites...</div>}>
            <SuiteList data={suites} />
          </Suspense>
        </div>

        <Polling />
      </div>
    </div>
  )
}
