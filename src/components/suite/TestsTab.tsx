'use client'

import Link from 'next/link'

import type { TSuite } from '../../app/suite/[suiteId]/loader'

export function TestsTab({ suite, suiteId }: { suite: TSuite; suiteId: number }) {
  return (
    <div className="space-y-4">
      {suite.tests.map((test) => (
        <Link
          key={test.id}
          href={`/suite/${suiteId}/test/${test.id}`}
          className="block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:bg-gray-50 transition-colors"
        >
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{test.label}</h3>
                <p className="text-sm text-gray-500" suppressHydrationWarning>
                  {formatDate(test.createdAt)}
                </p>
                <p className="text-xs text-gray-400">{test.steps.length} steps</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
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
