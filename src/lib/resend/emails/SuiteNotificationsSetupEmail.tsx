import * as React from 'react'

type SuiteNotificationsSetupEmailProps = {
  suiteId: number
  suiteName: string
  suiteNotificationsEmailAddress: string | null
}

/**
 * Email template for sending out a notification when a suite fails.
 */
export function SuiteNotificationsSetupEmail({
  suiteName,
  suiteNotificationsEmailAddress,
}: SuiteNotificationsSetupEmailProps) {
  return (
    <div>
      <h1>Suite Notifications Setup Success - {suiteName}</h1>

      <p>
        This email is to confirm that QA Use will send you an email if the suite fails. You can change this in the suite
        settings.
        <br />
        <br />
        <strong>Email address:</strong> {suiteNotificationsEmailAddress}
      </p>
    </div>
  )
}
