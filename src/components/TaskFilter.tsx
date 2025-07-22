'use client'

import { Button } from '@/components/ui/button'

interface TaskFilterProps {
  currentFilter: 'all' | 'running'
  onFilterChange: (filter: 'all' | 'running') => void
}

export function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className="px-4 py-2"
      >
        All Tasks
      </Button>
      <Button
        variant={currentFilter === 'running' ? 'default' : 'outline'}
        onClick={() => onFilterChange('running')}
        className="px-4 py-2"
      >
        Running Tasks
      </Button>
    </div>
  )
}
