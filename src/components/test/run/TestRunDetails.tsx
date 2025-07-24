'use client'

import Link from 'next/link'

import type { TTestRun } from '@/app/suite/[suiteId]/test/[testId]/run/[testRunId]/loader'

import { LivePreview } from './LivePreview'

export function TestRunDetails({ run }: { run: TTestRun }) {
  const { test, status, liveUrl } = run

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-0">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{test.label}</h2>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={status} />
          <span className="text-sm text-gray-500">{formatDate(test.createdAt)}</span>
        </div>

        <Link href={`/suite/${run.test.suiteId}/run/${run.suiteRunId}`} className="text-sm text-gray-500">
          Back to suite run
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-6 py-8">
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
            {test.steps && test.steps.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2">
                {test.steps.map((step) => (
                  <li key={step.id} className="text-gray-700">
                    {step.description}
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
        </div>

        {/* Right Column: Live Preview */}
        <div className="md:w-1/2 w-full">
          <LivePreview liveUrl={liveUrl} testStatus={status} />
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
