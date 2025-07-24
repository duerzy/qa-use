import { notFound } from 'next/navigation'

import { TestEditor } from '@/components/test/TestEditor'

import { loader } from './loader'

export default async function EditTestPage({ params }: { params: Promise<{ suiteId: string; testId: string }> }) {
  const { testId } = await params

  const test = await loader(parseInt(testId, 10))

  console.log(test)

  if (!test) {
    notFound()
  }

  return <TestEditor test={test} />
}
