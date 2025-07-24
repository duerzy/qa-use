import Link from 'next/link'

import type { TSuiteRun } from '@/app/suite/[suiteId]/run/[suiteRunId]/loader'

export function SuiteRunDetails({ run }: { run: TSuiteRun }) {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-0">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{run.suite.name}</h2>
          <div className="text-sm text-gray-500 mt-1">Created: {formatDate(run.suite.createdAt)}</div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={run.status} />
        </div>

        <Link href={`/suite/${run.suite.id}`} className="text-sm text-gray-500">
          Back to suite
        </Link>
      </div>

      {/* Test Runs List */}
      <div className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Runs</h3>
        <div className="flex flex-col gap-4">
          {run.testRuns && run.testRuns.length > 0 ? (
            run.testRuns.map((testRun) => (
              <Link
                key={testRun.id}
                href={`/suite/${run.suite.id}/test/${testRun.testId}/run/${testRun.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{testRun.test.label}</div>
                    <div className="text-sm text-gray-500">Created: {formatDate(testRun.createdAt)}</div>
                  </div>
                  <StatusBadge status={testRun.status} />
                </div>
              </Link>
            ))
          ) : (
            <div className="text-gray-400 italic">No test runs found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-100 text-gray-800'
  if (status === 'passed') color = 'bg-green-100 text-green-800'
  else if (status === 'failed') color = 'bg-red-100 text-red-800'
  else if (status === 'running') color = 'bg-blue-100 text-blue-800'
  else if (status === 'pending') color = 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
