import { notFound } from 'next/navigation'

import { TestDetails } from '@/components/test/TestDetails'

import { runTestAction } from './actions'
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

  const runTest = runTestAction.bind(null, testIdNum)

  return <TestDetails test={test} runTest={runTest} />
}
