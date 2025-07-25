import { notFound } from 'next/navigation'

import { SuiteDetails } from '@/components/suite/SuiteDetails'

import {
  createTestAction,
  deleteSuiteAction,
  runSuiteAction,
  setCronCadenceAction,
  setNotificationsEmailAddressAction,
} from './actions'
import { loader } from './loader'

export default async function SuitePage({ params }: { params: Promise<{ suiteId: string }> }) {
  const { suiteId } = await params
  const suiteIdNum = parseInt(suiteId, 10)

  if (isNaN(suiteIdNum)) {
    notFound()
  }

  const suite = await loader(suiteIdNum)
  if (!suite) {
    notFound()
  }

  const runSuite = runSuiteAction.bind(null, suiteIdNum)
  const deleteSuite = deleteSuiteAction.bind(null, suiteIdNum)
  const createTest = createTestAction.bind(null, suiteIdNum)
  const setCronCadence = setCronCadenceAction.bind(null, suiteIdNum)
  const setNotificationsEmailAddress = setNotificationsEmailAddressAction.bind(null, suiteIdNum)

  return (
    <SuiteDetails
      suite={suite}
      runSuite={runSuite}
      deleteSuite={deleteSuite}
      createTest={createTest}
      setCronCadence={setCronCadence}
      setNotificationsEmailAddress={setNotificationsEmailAddress}
    />
  )
}
