'use client'

import Link from 'next/link'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { TSuite } from '../../app/suite/[suiteId]/loader'
import { RunStatusBadge } from '../shared/RunStatusBadge'
import { formatDate } from '../shared/utils'

export function HistoryTab({ suite }: { suite: TSuite }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Run</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>{/* Actions */}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suite.runs.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="">
              No runs found
            </TableCell>
          </TableRow>
        )}

        {suite.runs.map((run) => (
          <TableRow key={run.id}>
            <TableCell>
              <RunStatusBadge status={run.status} />
            </TableCell>
            <TableCell>#{run.id}</TableCell>
            <TableCell suppressHydrationWarning>{formatDate(run.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Link href={`/suite/${run.suiteId}/run/${run.id}`}>View</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
