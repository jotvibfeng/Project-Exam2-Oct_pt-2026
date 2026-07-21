import { createFileRoute } from '@tanstack/react-router'

import VenuePage from '#/components/venuePage'

export const Route = createFileRoute('/venues')({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  return <VenuePage id={id} />
}
