import { notFound } from 'next/navigation'

import { TestRunDetails } from '@/components/test/run/TestRunDetails'

import { loader } from './loader'

export default async function TestRunPage({ params }: { params: Promise<{ suiteId: string; testRunId: string }> }) {
  const { suiteId, testRunId } = await params

  const suiteIdNum = parseInt(suiteId, 10)
  const testRunIdNum = parseInt(testRunId, 10)

  if (isNaN(suiteIdNum) || isNaN(testRunIdNum)) {
    notFound()
  }

  const run = await loader(suiteIdNum, testRunIdNum)

  if (!run) {
    notFound()
  }

  return <TestRunDetails run={run} />
}
