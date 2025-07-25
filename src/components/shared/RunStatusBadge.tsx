import type * as schema from '@/lib/db/schema'
import { ExhaustiveSwitchCheck } from '@/lib/types'

/**
 * Renders a generic badge for a run status.
 */
export function RunStatusBadge({ status }: { status: schema.TRunStatus }) {
  switch (status) {
    case 'passed':
      return (
        <div className={`px-2 py-1 w-min rounded-full text-xs font-medium bg-green-100 text-green-800`}>Passed</div>
      )
    case 'failed':
      return <div className={`px-2 py-1 w-min rounded-full text-xs font-medium bg-red-100 text-red-800`}>Failed</div>
    case 'pending':
      return <div className={`px-2 py-1 w-min rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>Pending</div>
    case 'running':
      return <div className={`px-2 py-1 w-min rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>Running</div>
    default:
      throw new ExhaustiveSwitchCheck(status)
  }
}
