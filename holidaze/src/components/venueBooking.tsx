import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createBooking } from '#/services/api.services'

export default function VenueBooking({
  venueId,
  maxGuests,
  onClose,
}: {
  venueId: string
  maxGuests: number
  onClose: () => void
}) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [guests, setGuests] = useState('1')

  const token = localStorage.getItem('token') || ''

  const today = new Date().toISOString().split('T')[0]
  const guestCount = Number(guests)
  const invalidDateRange =
    !dateFrom || !dateTo || new Date(dateTo) <= new Date(dateFrom)
  const invalidGuestCount =
    !Number.isInteger(guestCount) || guestCount < 1 || guestCount > maxGuests

  const { mutate, isPending, isError, error, isSuccess } = useMutation<
    unknown,
    Error
  >({
    mutationFn: () =>
      createBooking({ venueId, dateFrom, dateTo, guests: guestCount }, token),
    onSuccess: () => setTimeout(onClose, 2000),
  })

  return (
    <div className="island-shell w-full max-w-md rounded-3xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Book this venue
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="dateFrom"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Check-in date
          </label>
          <input
            id="dateFrom"
            type="date"
            min={today}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <div>
          <label
            htmlFor="dateTo"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Check-out date
          </label>
          <input
            id="dateTo"
            type="date"
            min={dateFrom || today}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          />
        </div>

        <div>
          <label
            htmlFor="guests"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Guests
          </label>
          <input
            id="guests"
            type="number"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          />
        </div>
      </div>

      {dateFrom && dateTo && invalidDateRange && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Check-out must be after check-in.
        </p>
      )}

      {guests && invalidGuestCount && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Guests must be between 1 and {maxGuests}.
        </p>
      )}

      {isError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      {isSuccess && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Booking confirmed!
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            if (invalidDateRange || invalidGuestCount) return
            mutate()
          }}
          disabled={isPending || invalidDateRange || invalidGuestCount}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </div>
  )
}
