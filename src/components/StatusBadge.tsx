import type * as schema from '@/lib/db/schema'

interface StatusBadgeProps {
  status: (typeof schema.test.$inferSelect)['status']
}

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-blue-100 text-blue-800' },
  running: { label: 'Running', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Finished', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
} as const

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
