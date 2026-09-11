export default function MyBookings({ bookings }: { bookings: any[] }) {
  const upcoming = bookings.filter((b) => new Date(b.dateTo) >= new Date())

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-(--sea-ink) mb-4">My Bookings</h2>
      {upcoming.length === 0 ? (
        <p className="text-(--sea-ink-soft) text-sm">No bookings yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {upcoming.map((booking) => (
            <li
              key={booking.id}
              className="bg-(--surface) border border-(--line) rounded-2xl p-4 shadow-sm"
            >
              <p className="font-semibold text-(--sea-ink)">
                {booking.venue?.name ?? 'Venue'}
              </p>
              <p className="text-sm text-(--sea-ink-soft) mt-1">
                {new Date(booking.dateFrom).toLocaleDateString()} →{' '}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm text-(--sea-ink-soft) mt-1">
                Guests: {booking.guests}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
