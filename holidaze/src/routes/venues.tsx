import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/venues')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/venues"!</div>
}
