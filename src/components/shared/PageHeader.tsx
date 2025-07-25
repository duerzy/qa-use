import Link from 'next/link'

export function PageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  back?: { href: string; label: string }
  title: string
  subtitle?: string
  actions?: ReadonlyArray<{ link: string; label: string }>
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-8">
        {back && (
          <Link
            href={back.href}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            {back.label}
          </Link>
        )}

        <h1 className="text-5xl tracking-tight font-black text-gray-900 mb-2">{title}</h1>
        {subtitle && <h3 className="text-2xl text-gray-700 mb-2">{subtitle}</h3>}

        {actions && (
          <div className="flex items-center gap-3">
            {actions.map((action) => (
              <Link
                key={action.link}
                href={action.link}
                className="text-gray-500 hover:text-gray-950 transition-colors hover:underline"
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
