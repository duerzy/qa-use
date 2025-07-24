import { notFound } from 'next/navigation'

import { SuiteRunDetails } from '@/components/suite/run/SuiteRunDetails'

import { loader } from './loader'

export default async function SuiteRunPage({ params }: { params: Promise<{ suiteId: string; suiteRunId: string }> }) {
  const { suiteRunId } = await params
  const suiteRunIdNum = parseInt(suiteRunId, 10)

  const run = await loader({ suiteRunId: suiteRunIdNum })

  if (!run) {
    notFound()
  }

  return <SuiteRunDetails run={run} />
}
