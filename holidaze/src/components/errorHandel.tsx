export default function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <p
      role="alert"
      className="mt-2 rounded-lg bg-red-500/15 px-3 py-2 text-sm font-medium text-red-100"
    >
      {message}
    </p>
  )
}
