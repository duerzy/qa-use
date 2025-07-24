'use client'

import { ExternalLink, Monitor } from 'lucide-react'
import { useCallback } from 'react'

export function LivePreview({
  liveUrl,
  testStatus,
}: {
  liveUrl: string | null | undefined
  testStatus: 'pending' | 'running' | 'passed' | 'failed'
}) {
  const handleOpenExternal = useCallback(() => {
    if (liveUrl) {
      window.open(liveUrl, '_blank')
    }
  }, [liveUrl])

  const showPlaceholder = !liveUrl

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Live Preview
        </h2>
        {liveUrl && (
          <button
            onClick={handleOpenExternal}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </button>
        )}
      </div>

      <div className="p-6">
        {showPlaceholder ? (
          <div
            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500"
            style={{ aspectRatio: '16/10', minHeight: '400px' }}
          >
            <Monitor className="w-12 h-12 mb-4 text-gray-300" />
            <div className="text-center">
              <p className="font-medium mb-2">
                {testStatus === 'passed' || testStatus === 'failed' ? 'Test completed' : 'Live preview not available'}
              </p>
              <p className="text-sm">
                {testStatus === 'pending'
                  ? 'Waiting for test to start...'
                  : testStatus === 'passed' || testStatus === 'failed'
                    ? 'Test execution has finished'
                    : 'Preview will appear when test is running'}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-full relative rounded-lg overflow-hidden border border-gray-200"
            style={{ aspectRatio: '16/10', minHeight: '400px' }}
          >
            <iframe src={liveUrl} className="w-full h-full border-0" title="Live test preview" allow="fullscreen" />
          </div>
        )}
      </div>
    </div>
  )
}
