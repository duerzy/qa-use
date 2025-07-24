'use client'

import { ArrowLeft, Monitor } from 'lucide-react'
import Link from 'next/link'

import type { TTestRun } from '@/app/suite/[suiteId]/test/[testId]/run/[testRunId]/loader'
import { Button } from '@/components/ui/button'

export function TestRunDetails({ run }: { run: TTestRun }) {
  const { test, error, status, publicShareUrl, liveUrl, testRunSteps } = run

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex gap-4 items-baseline">
          <div className="mr-auto">
            <Link href={`/suite/${run.test.suiteId}/run/${run.suiteRunId}`} className="text-sm text-gray-500">
              <Button size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to suite run
              </Button>
            </Link>

            <h2 className="text-4xl font-semibold text-gray-900 mt-5">{test.label}</h2>
            <h3 className="text-2xl text-gray-500 mt-1" suppressHydrationWarning>
              {formatDate(test.createdAt)}
            </h3>

            <div className="flex items-center gap-2">
              <Link href={`/suite/${run.test.suiteId}/test/${run.test.id}`} className="text-base text-gray-500 mt-2">
                View test
              </Link>
              {publicShareUrl && (
                <Link href={publicShareUrl} className="text-base text-gray-500 mt-2">
                  View Agent
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-8 py-8">
          {/* Left Column: Test Specification */}
          <div className="md:w-1/2 w-full flex flex-col gap-8">
            {/* Test Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">{test.task}</p>
            </div>

            {/* Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Steps</h3>
              {testRunSteps && testRunSteps.length > 0 ? (
                <ol className="list-decimal list-inside space-y-2">
                  {testRunSteps.map((step) => (
                    <li key={step.id} className="text-gray-700">
                      {step.testStep.description} <StatusBadge status={step.status} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="italic text-gray-400">No steps provided.</p>
              )}
            </div>
            {/* Evaluation Criteria */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Evaluation Criteria</h3>
              <p className="text-gray-700">{test.evaluation}</p>
            </div>
            {/* Result */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mr-auto">Result</h3>

                <StatusBadge status={status} />
              </div>
              <p className="text-gray-700">{error ? error : 'No error'}</p>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="md:w-1/2 w-full">
            <LivePreview liveUrl={liveUrl} testStatus={status} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: TTestRun['status'] }) {
  switch (status) {
    case 'passed':
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
          Passed
        </span>
      )
    case 'failed':
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800`}>
          Failed
        </span>
      )
    case 'pending':
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
          Pending
        </span>
      )
    case 'running':
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
          Running
        </span>
      )
    default:
      return (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
          {status}
        </span>
      )
  }
}

export function LivePreview({
  liveUrl,
  testStatus,
}: {
  liveUrl: string | null | undefined
  testStatus: 'pending' | 'running' | 'passed' | 'failed'
}) {
  const showPlaceholder = !liveUrl

  if (showPlaceholder) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div
            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500"
            style={{ aspectRatio: '16/10', minHeight: '400px' }}
          >
            <Monitor className="w-12 h-12 mb-4 text-gray-300" />
            <div className="text-center">
              <p className="font-medium mb-2">
                {testStatus === 'passed' || testStatus === 'failed' ? 'Test completed' : 'Live preview not available'}
              </p>
              <p className="text-sm">
                {testStatus === 'pending'
                  ? 'Waiting for test to start...'
                  : testStatus === 'passed' || testStatus === 'failed'
                    ? 'Test execution has finished'
                    : 'Preview will appear when test is running'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <div
          className="w-full relative rounded-lg overflow-hidden border border-gray-200"
          style={{ aspectRatio: '16/10', minHeight: '400px' }}
        >
          <iframe src={liveUrl} className="w-full h-full border-0" title="Live test preview" allow="fullscreen" />
        </div>
      </div>
    </div>
  )
}

function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
