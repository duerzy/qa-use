import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

import { PageHeader } from '@/components/shared/PageHeader'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { formatDate } from '@/components/shared/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { createSuiteAction, importSuiteAction } from './actions'
import { loader, type TSuite } from './loader'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const suites = await loader()

  return (
    <Fragment>
      <PageHeader
        title="All Suites"
        subtitle="QA Use"
        actions={[{ link: 'https://github.com/browser-use/qa-use', label: 'Star on GitHub' }]}
      />
      {/* Header */}

      {/* Suites List */}

      <SectionHeader
        title="Test Suites"
        actions={[
          //
          <CreateSuiteDialog key="create-suite-dialog" />,
          <ImportSuiteDialog key="import-suite-dialog" />,
        ]}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Tests</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Cron</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suites.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="">
                No suites found...
              </TableCell>
            </TableRow>
          )}
          {suites.map((suite) => (
            <TableRow key={suite.id}>
              <TableCell className="font-medium">{suite.name}</TableCell>
              <TableCell>{suite.tests.length} tests</TableCell>
              <TableCell>{formatDate(suite.createdAt)}</TableCell>
              <TableCell>{getCronLabel(suite.cronCadence)}</TableCell>
              <TableCell>{getLastRunLabel(suite)}</TableCell>
              <TableCell className="text-right">
                <Link href={`/suite/${suite.id}`}>View</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  )
}

function CreateSuiteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Plus className="size-4" />
          Create Suite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new test suite</DialogTitle>
          <DialogDescription>A test suite is a collection of tests that you can run together.</DialogDescription>

          <form action={createSuiteAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Suite Name
              </label>
              <Input id="name" name="name" type="text" placeholder="e.g., Login functionality test" required />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function getCronLabel(cronCadence: TSuite['cronCadence']) {
  switch (cronCadence) {
    case 'hourly':
      return 'Hourly'
    case 'daily':
      return 'Daily'
    default:
      return 'Never'
  }
}

function ImportSuiteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Plus className="size-4" />
          Import Suite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import a test suite</DialogTitle>
          <DialogDescription>Import a test suite from a JSON file.</DialogDescription>

          <form action={importSuiteAction} className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Suite File
              </label>
              <Input type="file" id="file" name="file" accept=".json" required />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Import</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function getLastRunLabel(suite: { runs: { createdAt: Date }[] }) {
  if (suite.runs.length === 0) {
    return 'Never'
  }

  return formatDate(suite.runs[0].createdAt)
}
