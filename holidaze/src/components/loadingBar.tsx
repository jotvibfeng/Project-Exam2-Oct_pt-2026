import { Spinner } from '@digdir/designsystemet-react'

export default function LoadingBar() {
  return (
    <main className="page-wrap flex items-center justify-center px-4 py-20">
      <Spinner aria-label="Loading" data-size="xl" />
    </main>
  )
}
