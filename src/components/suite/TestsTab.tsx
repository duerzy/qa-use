'use client'

import Link from 'next/link'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { TSuite } from '../../app/suite/[suiteId]/loader'
import { formatDate } from '../shared/utils'

/**
 * Shows a list of tests in a suite.
 */
export function TestsTab({ suite, suiteId }: { suite: TSuite; suiteId: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>{/* Actions */}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suite.tests.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="">
              No tests found...
            </TableCell>
          </TableRow>
        )}

        {suite.tests.map((test) => (
          <TableRow key={test.id}>
            <TableCell>{test.label}</TableCell>
            <TableCell suppressHydrationWarning>{formatDate(test.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Link href={`/suite/${suiteId}/test/${test.id}`}>View</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
