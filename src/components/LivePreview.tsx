'use client'

export function LivePreview({
  liveUrl,
  taskDescription,
}: {
  liveUrl: string | null | undefined
  taskDescription: string
}) {
  const handleClick = () => {
    if (liveUrl) {
      window.open(liveUrl, '_blank')
    }
  }

  if (!liveUrl) {
    return (
      <div
        className="w-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm cursor-not-allowed"
        style={{ aspectRatio: '1280/1050' }}
      >
        No live preview available
      </div>
    )
  }

  return (
    <div
      className="w-full relative cursor-pointer hover:opacity-90 transition-opacity"
      style={{ aspectRatio: '1280/1050' }}
      onClick={handleClick}
      title={`Click to open live preview: ${taskDescription}`}
    >
      <iframe src={liveUrl} className="w-full h-full border-0" title={`Live preview: ${taskDescription}`} />
      <div className="absolute inset-0 bg-transparent" />
    </div>
  )
}
