import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '#/services/api.services'

export default function VenueBooking({
  venueId,
  onClose,
}: {
  venueId: string
  onClose: () => void
}) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState(1)

  const token = localStorage.getItem('token') || ''

  const { mutate, isPending, isError, error, isSuccess } = useMutation<unknown, Error>({
    mutationFn: () => createBooking({ venueId, dateFrom, dateTo, guests }, token),
    onSuccess: () => setTimeout(onClose, 2000),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="island-shell rounded-2xl p-6 w-full max-w-md">
        <h2>Book this venue</h2>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />

        {isError && <p className="text-red-500">{error.message}</p>}
        {isSuccess && <p className="text-green-500">Booking confirmed!</p>}

        <button onClick={() => mutate()} disabled={isPending}>
          {isPending ? 'Booking…' : 'Confirm Booking'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
