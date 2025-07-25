import Link from 'next/link'
import { Fragment, useMemo } from 'react'

import type { TSuiteRun } from '@/app/suite/[suiteId]/run/[suiteRunId]/loader'
import { Polling } from '@/components/Polling'
import { PageHeader } from '@/components/shared/PageHeader'
import { RunStatusBadge } from '@/components/shared/RunStatusBadge'
import { RunStatusIcon } from '@/components/shared/RunStatusIcon'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { formatDate } from '@/components/shared/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function SuiteRunDetails({ run }: { run: TSuiteRun }) {
  const { nOfPassingTests, nOfFailedTests } = useMemo(() => {
    return run.testRuns.reduce(
      (acc, testRun) => {
        if (testRun.status === 'passed') acc.nOfPassingTests++
        else if (testRun.status === 'failed') acc.nOfFailedTests++
        return acc
      },
      { nOfPassingTests: 0, nOfFailedTests: 0 },
    )
  }, [run.testRuns])

  return (
    <Fragment>
      <PageHeader
        title={`Suite Run #${run.id}`}
        subtitle={run.suite.name}
        back={{ href: `/suite/${run.suite.id}`, label: 'Back to Suite' }}
      />

      <SectionHeader
        title="Test Runs"
        actions={[
          <p key="test-runs-status" className="text-gray-500 text-sm font-medium ml-4">
            {nOfPassingTests} passed, {nOfFailedTests} failed
          </p>,
          <RunStatusBadge key="test-runs-status-badge" status={run.status} />,
        ]}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {run.testRuns.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="">
                No test runs found...
              </TableCell>
            </TableRow>
          )}
          {run.testRuns.map((testRun) => (
            <TableRow key={testRun.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <RunStatusIcon status={testRun.status} />
                {testRun.test.label}
              </TableCell>
              <TableCell suppressHydrationWarning>{formatDate(testRun.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Link href={`/suite/${run.suite.id}/test/${testRun.testId}/run/${testRun.id}`}>View</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Polling poll={run.status === 'running' || run.status === 'pending'} />
    </Fragment>
  )
}
