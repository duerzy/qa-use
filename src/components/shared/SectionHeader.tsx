/**
 * Renders a section header with a title and actions.
 */
export function SectionHeader({ title, actions }: { title: string; actions: React.ReactNode[] }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <SectionHeaderTitle title={title} />
      {actions}
    </div>
  )
}

export function SectionHeaderTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-gray-900 mr-auto">{title}</h2>
}
