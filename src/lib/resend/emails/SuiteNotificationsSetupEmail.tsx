import * as React from 'react'

type SuiteNotificationsSetupEmailProps = {
  suiteId: number
  suiteName: string
  suiteDomain: string
  suiteNotificationsEmailAddress: string | null
}

/**
 * Email template for sending out a notification when a suite fails.
 */
export function SuiteNotificationsSetupEmail({
  suiteName,
  suiteDomain,
  suiteNotificationsEmailAddress,
}: SuiteNotificationsSetupEmailProps) {
  return (
    <div>
      <h1>Suite Notifications Setup - {suiteName}</h1>
      <h2>{suiteDomain}</h2>

      <p>Use QA will send you an email if the suite fails to {suiteNotificationsEmailAddress}!</p>
    </div>
  )
}
