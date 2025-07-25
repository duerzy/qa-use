'use client'

import { Monitor } from 'lucide-react'
import { Fragment, useMemo } from 'react'

import type { TTestRun } from '@/app/suite/[suiteId]/test/[testId]/run/[testRunId]/loader'
import { Polling } from '@/components/Polling'
import { PageHeader } from '@/components/shared/PageHeader'
import { RunStatusBadge } from '@/components/shared/RunStatusBadge'
import { RunStatusIcon } from '@/components/shared/RunStatusIcon'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { formatDate } from '@/components/shared/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function TestRunDetails({ run }: { run: TTestRun }) {
  const { test, error, status, publicShareUrl, liveUrl, testRunSteps } = run

  const actions = useMemo(() => {
    const actions = [{ link: `/suite/${run.test.suiteId}/test/${run.test.id}`, label: 'View Test' }]

    if (publicShareUrl) {
      actions.push({ link: publicShareUrl, label: 'View Agent' })
    }

    return actions
  }, [run.test.suiteId, run.test.id, publicShareUrl])

  return (
    <Fragment>
      {/* Header */}

      <PageHeader
        title={test.label}
        subtitle={formatDate(test.createdAt)}
        back={{ href: `/suite/${run.test.suiteId}/run/${run.suiteRunId}`, label: 'Back to Suite Run' }}
        actions={actions}
      />

      <div className="mt-5">
        <SectionHeader
          title="Steps"
          actions={[
            //
            <RunStatusBadge key="test-runs-status-badge" status={run.status} />,
          ]}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>#</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>{test.task}</TableCell>
            </TableRow>

            {testRunSteps.map((trs) => (
              <TableRow key={trs.id}>
                <TableCell>
                  <RunStatusIcon status={trs.status} />
                </TableCell>
                <TableCell>{trs.testStep.order}</TableCell>
                <TableCell>{trs.testStep.description}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell>
                <RunStatusIcon status={status} />
              </TableCell>
              <TableCell></TableCell>
              <TableCell className="max-w-[300px] break-words">{test.evaluation}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-5">
        <SectionHeader title="Result" actions={[<RunStatusBadge key="test-runs-status-badge" status={run.status} />]} />

        {error && <p className="text-red-700">{error}</p>}
      </div>

      {/* Preview */}

      <div className="mt-5">
        <SectionHeader title="Live Preview" actions={[]} />

        <LivePreview liveUrl={liveUrl} testStatus={status} />
      </div>

      <Polling poll={status === 'running'} />
    </Fragment>
  )
}

export function LivePreview({
  liveUrl,
  testStatus,
}: {
  liveUrl: string | null | undefined
  testStatus: 'pending' | 'running' | 'passed' | 'failed'
}) {
  const showPlaceholder = !liveUrl

  if (showPlaceholder) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center text-gray-500 bg-white border border-gray-200"
        style={{ aspectRatio: '16/10', minHeight: '400px' }}
      >
        <Monitor className="w-12 h-12 mb-4 text-gray-300" />
        <div className="text-center">
          <p className="font-medium mb-2">
            {testStatus === 'passed' || testStatus === 'failed' ? 'Test completed' : 'Live preview not available'}
          </p>
          <p className="text-sm">
            {testStatus === 'pending'
              ? 'Waiting for test to start...'
              : testStatus === 'passed' || testStatus === 'failed'
                ? 'Test execution has finished'
                : 'Preview will appear when test is running'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full relative overflow-hidden border border-gray-200"
      style={{ aspectRatio: '1280/1050', minHeight: '400px' }}
    >
      <iframe src={liveUrl} className="w-full h-full border-0" title="Live test preview" allow="fullscreen" />
    </div>
  )
}
