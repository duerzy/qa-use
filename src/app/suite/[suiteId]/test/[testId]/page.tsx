import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { loader } from './loader'

export default async function TestPage({ params }: { params: Promise<{ suiteId: string; testId: string }> }) {
  const { suiteId, testId } = await params
  const suiteIdNum = parseInt(suiteId, 10)
  const testIdNum = parseInt(testId, 10)

  if (isNaN(suiteIdNum) || isNaN(testIdNum)) {
    notFound()
  }

  const test = await loader(testIdNum)

  if (!test) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8 pb-9">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/suite/${suiteId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Suite
          </Link>

          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.label}</h1>
              <p className="text-sm text-gray-500">
                Suite ID: {suiteId} | Test ID: {testIdNum}
              </p>
            </div>

            <Link href={`/suite/${suiteId}/test/${testIdNum}/edit`} className="text-sm text-gray-500">
              <Button>
                <Pencil className="w-4 h-4" />
                Edit Test
              </Button>
            </Link>
          </div>
        </div>

        {/* Steps */}

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Steps</h2>

          <div className="flex flex-col gap-2">
            {test.steps.map((step) => (
              <div key={step.id} className="flex gap-2">
                <h3 className="bg-gray-900 w-5 h-5 flex items-center justify-center text-white text-base font-medium flex-none">
                  {step.order}
                </h3>
                <p className="text-gray-600 flex-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Runs */}

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Runs</h2>

          <div className="flex flex-col gap-2">
            {test.runs.map((run) => (
              <div key={run.id} className="flex items-center">
                <div className="flex flex-col gap-2 mr-auto">
                  <h3 className="text-lg font-medium">Run {run.id}</h3>
                  <p className="text-base text-gray-500">
                    {run.status === 'pending' ? 'Pending' : run.status === 'passed' ? 'Passed' : 'Failed'}
                    <span className="ml-1 text-gray-500" suppressHydrationWarning>
                      {run.createdAt.toLocaleDateString()} {run.createdAt.toLocaleTimeString()}
                    </span>
                  </p>
                </div>

                <Link href={`/suite/${suiteId}/test/${testIdNum}/run/${run.id}`} className="text-sm text-gray-500">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
