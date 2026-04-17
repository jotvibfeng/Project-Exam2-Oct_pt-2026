import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <h1 className="island-headline mb-4 text-center">About Holidaze</h1>
    </main>
  )
}
