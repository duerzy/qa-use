'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { TPageData } from '@/app/page'

export function SuiteList({ data }: { data: TPageData }) {
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
      {data.map((suite) => (
        <Link
          key={suite.id}
          href={`/suite/${suite.id}`}
          className="block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:bg-gray-50 transition-colors"
        >
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{suite.name}</h3>
                <p className="text-sm text-gray-500">{formatDate(suite.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
