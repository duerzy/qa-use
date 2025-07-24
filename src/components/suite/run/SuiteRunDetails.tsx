import Link from 'next/link'
import { useMemo } from 'react'

import type { TSuiteRun } from '@/app/suite/[suiteId]/run/[suiteRunId]/loader'
import { Polling } from '@/components/Polling'

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

  const { nOfPassingTests, nOfFailedTests } = useMemo(() => {
    return run.testRuns.reduce(
      (acc, testRun) => {
        if (testRun.status === 'passed') acc.nOfPassingTests++
        else if (testRun.status === 'failed') acc.nOfFailedTests++
        return acc
      },
      { nOfPassingTests: 0, nOfFailedTests: 0 },
    )
  }, [run.testRuns])

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex gap-4 items-baseline">
          <div className="mr-auto">
            <Link href={`/suite/${run.suite.id}`} className="text-sm text-gray-500">
              Back to suite
            </Link>
            <h2 className="text-4xl font-semibold text-gray-900 mt-2">Suite Run #{run.id}</h2>
            <h3 className="text-2xl text-gray-500 mt-1">{run.suite.name}Suite</h3>
          </div>

          <StatusBadge status={run.status} />
        </div>

        {/* Test Runs List */}
        <div className="py-8">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mr-auto">Test Runs</h3>

            <p>
              {nOfPassingTests} passed, {nOfFailedTests} failed
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {run.testRuns.map((testRun) => (
              <Link
                key={testRun.id}
                href={`/suite/${run.suite.id}/test/${testRun.testId}/run/${testRun.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{testRun.test.label}</div>
                    <div className="text-sm text-gray-500" suppressHydrationWarning>
                      Created: {formatDate(testRun.createdAt)}
                    </div>
                  </div>
                  <StatusBadge status={testRun.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Polling poll={run.status === 'running'} />
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
