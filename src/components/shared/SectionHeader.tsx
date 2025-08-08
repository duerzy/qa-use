/**
 * Renders a section header with a title and actions.
 */
export function SectionHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions: React.ReactNode[]
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex flex-col gap-1 mr-auto">
        <SectionHeaderTitle title={title} />
        {subtitle && <SectionHeaderSubtitle subtitle={subtitle} />}
      </div>

      {actions}
    </div>
  )
}

export function SectionHeaderTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-gray-900 mr-auto">{title}</h2>
}

export function SectionHeaderSubtitle({ subtitle }: { subtitle: string }) {
  return <p className="text-sm text-gray-500">{subtitle}</p>
}
