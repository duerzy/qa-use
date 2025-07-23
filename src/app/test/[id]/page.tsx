import { eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LivePreview } from '@/components/LivePreview'
import { Polling } from '@/components/Polling'
import { StatusBadge } from '@/components/StatusBadge'
import { TestSteps } from '@/components/TestSteps'
import { client } from '@/lib/api/client'
import { db } from '@/lib/db/db'
import { test, testStep } from '@/lib/db/schema'

async function loader(testId: number) {
  'use server'

  const dbTest = await db.query.test.findFirst({
    where: eq(test.id, testId),
    with: {
      steps: {
        orderBy: [testStep.order],
      },
    },
  })

  if (!dbTest) {
    return null
  }

  const buAgent = await client.GET('/api/v1/task/{task_id}', {
    params: { path: { task_id: dbTest.browserUseId } },
  })

  return { dbTest, buAgent: buAgent.data }
}

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const testId = parseInt(id, 10)
  if (isNaN(testId)) {
    notFound()
  }

  const test = await loader(testId)
  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Suites
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.dbTest.label}</h1>
              <div className="flex items-center gap-4 mb-4">
                <StatusBadge status={test.dbTest.status} />
                <span className="text-gray-500 text-sm">{formatDate(test.dbTest.createdAt)}</span>
              </div>
              <p className="text-gray-700 max-w-2xl">{test.dbTest.task}</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {test.dbTest.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-900 mb-2">Test Error</h3>
            <p className="text-red-700 text-sm">{test.dbTest.error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Test Steps */}
          <div className="space-y-6">
            <TestSteps steps={test.dbTest.steps} evaluation={test.dbTest.evaluation} />
          </div>

          {/* Right Column - Live Preview */}
          <div className="space-y-6">
            <LivePreview liveUrl={test.buAgent?.live_url} testStatus={test.dbTest.status} />
          </div>
        </div>

        <Polling />
      </div>
    </div>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
