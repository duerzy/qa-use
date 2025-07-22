import type { components } from '@/lib/api/v1'

interface StatusBadgeProps {
  status: components['schemas']['TaskStatusEnum']
}

const statusConfig = {
  created: { label: 'Created', className: 'bg-blue-100 text-blue-800' },
  running: { label: 'Running', className: 'bg-yellow-100 text-yellow-800' },
  finished: { label: 'Finished', className: 'bg-green-100 text-green-800' },
  stopped: { label: 'Stopped', className: 'bg-gray-100 text-gray-800' },
  paused: { label: 'Paused', className: 'bg-orange-100 text-orange-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
} as const

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.created

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
