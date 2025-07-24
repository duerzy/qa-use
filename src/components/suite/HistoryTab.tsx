'use client'

import { Check, RotateCcw, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { TSuite } from '../../app/suite/[suiteId]/loader'

export function HistoryTab({ suite }: { suite: TSuite }) {
  const [expandedRuns, setExpandedRuns] = useState<Set<number>>(new Set())

  const toggleRun = (runId: number) => {
    const newExpanded = new Set(expandedRuns)

    if (newExpanded.has(runId)) {
      newExpanded.delete(runId)
    } else {
      newExpanded.add(runId)
    }

    setExpandedRuns(newExpanded)
  }

  if (suite.runs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No suite runs found</p>
        <p className="text-gray-400 text-sm">Click &quot;Run Suite&quot; to start your first test run</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {suite.runs.map((run) => {
        const status = getSuiteRunStatus(run)
        const isExpanded = expandedRuns.has(run.id)

        return (
          <div key={run.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleRun(run.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Suite Run #{run.id}</h3>
                  <p className="text-sm text-gray-500">{formatDate(run.createdAt)}</p>
                  <StatusBadge status={status} />
                </div>
              </div>

              <Link href={`/suite/${suite.id}/run/${run.id}`} className="text-xs text-gray-500">
                View
              </Link>
            </button>

            {isExpanded && run.testRuns && run.testRuns.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50">
                {run.testRuns.map((testRun) => (
                  <div
                    key={testRun.id}
                    className="px-6 py-3 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={testRun.status} />
                      <span className="text-sm text-gray-700">{testRun.test.label}</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{testRun.status}</span>

                    <Link
                      href={`/suite/${suite.id}/test/${testRun.test.id}/run/${testRun.id}`}
                      className="text-xs text-gray-500"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function getSuiteRunStatus(suiteRun: TSuite['runs'][number]) {
  if (!suiteRun.testRuns || suiteRun.testRuns.length === 0) {
    return 'passing'
  }

  const hasRunning = suiteRun.testRuns.some((tr) => tr.status === 'pending' || tr.status === 'running')
  const hasFailed = suiteRun.testRuns.some((tr) => tr.status === 'failed')

  if (hasRunning) return 'running'
  if (hasFailed) return 'failing'
  return 'passing'
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'passed':
      return <Check className="w-4 h-4 text-green-600" />
    case 'failed':
      return <X className="w-4 h-4 text-red-600" />
    case 'pending':
    case 'running':
      return <RotateCcw className="w-4 h-4 text-blue-600 animate-spin" />
    default:
      return <RotateCcw className="w-4 h-4 text-gray-400" />
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'passing':
      return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>Passing</span>
    case 'failing':
      return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800`}>Failing</span>
    case 'running':
      return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>Running</span>
    default:
      return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>Unknown</span>
  }
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
