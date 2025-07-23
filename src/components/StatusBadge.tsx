import type * as schema from '@/lib/db/schema'

const STATUS = {
  pending: { label: 'Pending', className: 'bg-blue-100 text-blue-800' },
  running: { label: 'Running', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Passed', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
} as const

export function StatusBadge({ status }: { status: (typeof schema.test.$inferSelect)['status'] }) {
  const { label, className } = STATUS[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
