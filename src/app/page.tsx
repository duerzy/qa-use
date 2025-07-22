'use client'

import { ApiKeyInput } from '@/components/ApiKeyInput'
import { CreateTaskButton } from '@/components/CreateTaskButton'
import { TaskFilter } from '@/components/TaskFilter'
import { TaskGrid } from '@/components/TaskGrid'
import { useTasks } from '@/hooks/useTasks'

export default function Home() {
  const { filteredTasks, loading, error, filter, setFilter, refetch } = useTasks()

  const handleTaskCreated = () => {
    // Refresh the task list after creating a new task
    refetch()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Monitor and manage your browser automation tasks</p>
            </div>
            <ApiKeyInput />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
            <div className="flex items-center gap-3">
              <CreateTaskButton onTaskCreated={handleTaskCreated} />
              {!loading && (
                <button
                  onClick={refetch}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <TaskGrid tasks={filteredTasks} loading={loading} error={error} />
      </div>
    </div>
  )
}
