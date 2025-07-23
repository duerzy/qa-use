'use client'

import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { TPageData } from '@/app/page'
import { StatusBadge } from '@/components/StatusBadge'

export function SuiteList({ data }: { data: TPageData }) {
  const [expandedSuites, setExpandedSuites] = useState<Set<number>>(new Set())

  const toggleSuite = (suiteId: number) => {
    const newExpanded = new Set(expandedSuites)
    if (newExpanded.has(suiteId)) {
      newExpanded.delete(suiteId)
    } else {
      newExpanded.add(suiteId)
    }
    setExpandedSuites(newExpanded)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No test suites found</p>
        <p className="text-gray-400 text-sm">Click &quot;Run Suite&quot; to create your first test suite</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((suite) => {
        const isExpanded = expandedSuites.has(suite.id)

        return (
          <div key={suite.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Suite Header */}
            <button
              onClick={() => toggleSuite(suite.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{suite.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(suite.createdAt)} • {suite.tests.length} tests
                  </p>
                </div>
              </div>
              <StatusBadge status={getSuiteStatus(suite)} />
            </button>

            {/* Expanded Tests */}
            {isExpanded && (
              <div className="border-t border-gray-100">
                {suite.tests.map((test) => (
                  <Link
                    key={test.id}
                    href={`/test/${test.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-900">{test.label}</h4>
                        <StatusBadge status={test.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{test.task}</p>
                      <p className="text-xs text-gray-500">
                        {test.steps.length} steps • {formatDate(test.createdAt)}
                      </p>
                      {test.error && <p className="text-xs text-red-600 mt-1 font-medium">Error: {test.error}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Utility functions

function getSuiteStatus(suite: TPageData[number]) {
  if (suite.tests.some((test) => test.status === 'pending' || test.status === 'running')) {
    return 'pending'
  }

  if (suite.tests.some((test) => test.status === 'failed')) {
    return 'failed'
  }

  return 'completed'
}
