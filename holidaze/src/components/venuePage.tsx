import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVenueById } from '#/services/api.services'
import LoadingBar from './loadingBar'
import VenueBooking from './venueBooking'
import ErrorMessage from '#/components/errorHandel'
import { getAverageRating, getUserRating, saveRating } from '#/utils/ratings'

export default function VenuePage({ id }: { id?: string }) {
  const [activeImg, setActiveImg] = useState(0)
  const [showBooking, setShowBooking] = useState(false)
  const [ratingVersion, setRatingVersion] = useState(0)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const {
    data: venue,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['venue', id],
    queryFn: async () => {
      const data = await getVenueById(id!)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return data
    },
    enabled: !!id,
  })

  if (!id)
    return (
      <main className="page-wrap px-4 py-20 text-center">
        <p className="text-(--sea-ink-soft)">No venue selected.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-(--lagoon) hover:underline"
        >
          ← Browse venues
        </Link>
      </main>
    )

  if (isPending) return <LoadingBar />

  if (isError)
    return (
      <main className="page-wrap px-4 py-20 text-center">
        <p className="text-(--sea-ink-soft)">Could not find the venue.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-(--lagoon) hover:underline"
        >
          ← Back to venues
        </Link>
      </main>
    )

  const amenities = [
    { label: 'WiFi', enabled: venue.meta.wifi },
    { label: 'Parking', enabled: venue.meta.parking },
    { label: 'Breakfast', enabled: venue.meta.breakfast },
    { label: 'Pets allowed', enabled: venue.meta.pets },
  ]

  const displayRating = getAverageRating(venue.id, venue.rating)

  void ratingVersion

  return (
    <main className="page-wrap px-4 pb-20 pt-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-3 text-sm text-(--sea-ink-soft) no-underline hover:text-(--sea-ink) transition"
      >
        ← Back to venues
      </Link>

      {venue.media.length > 0 && (
        <div className="mb-8">
          <div className="overflow-hidden rounded-2xl  w-full bg-(--line)">
            <img
              src={venue.media[activeImg]?.url}
              alt={venue.media[activeImg]?.alt || venue.name}
              className="h-full w-full object-cover"
            />
          </div>
          {venue.media.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {venue.media.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                    i === activeImg
                      ? 'border-(--lagoon)'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || venue.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
            {venue.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-(--sea-ink-soft)">
            <span className="flex items-center gap-1">
              <span className="text-(--lagoon)">★</span>
              {displayRating.toFixed(1)}
            </span>
            <span>·</span>
            <span>Up to {venue.maxGuests} guests</span>
          </div>

          {venue.description && (
            <p className="mt-6 leading-relaxed text-(--sea-ink-soft)">
              {venue.description}
            </p>
          )}

          <GuestRating
            venueId={venue.id}
            onRated={() => setRatingVersion((v) => v + 1)}
          />

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-(--sea-ink)">
              Amenities
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {amenities.map(({ label, enabled }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${
                    enabled
                      ? 'border-(--lagoon) text-(--lagoon-deep)'
                      : 'border-(--line) text-(--sea-ink-soft) opacity-50'
                  }`}
                >
                  <span>{enabled ? '✓' : '✕'}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="island-shell h-fit w-full max-w-md justify-self-center rounded-2xl border border-(--line) p-6 lg:max-w-none lg:justify-self-stretch">
          <div className="mb-4">
            <span className="text-3xl font-bold text-(--sea-ink)">
              ${venue.price}
            </span>
            <span className="text-sm text-(--sea-ink-soft)"> / night</span>
          </div>
          <button
            onClick={() => {
              const token = localStorage.getItem('token')
              if (!token) {
                setShowLoginPrompt(true)
                return
              }
              setShowBooking(true)
            }}
            className="rounded-xl bg-(--lagoon) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--lagoon-deep) cursor-pointer"
          >
            Book Now
          </button>
          {showLoginPrompt && (
            <div className="mt-3">
              <ErrorMessage message="For booking your dream venue, you need an account." />
              <p className="mt-2 text-sm text-(--sea-ink-soft)">
                <Link to="/login" className="text-(--lagoon-deep) underline">
                  Log in
                </Link>{' '}
                or{' '}
                <Link to="/register" className="text-(--lagoon-deep) underline">
                  create an account
                </Link>{' '}
                to continue.
              </p>
            </div>
          )}
          {showBooking && (
            <VenueBooking
              venueId={venue.id}
              maxGuests={venue.maxGuests}
              onClose={() => setShowBooking(false)}
            />
          )}
          <p className="mt-3 text-center text-xs text-(--sea-ink-soft)">
            You won't be charged yet
          </p>
        </div>
      </div>
    </main>
  )
}

function GuestRating({
  venueId,
  onRated,
}: {
  venueId: string
  onRated: () => void
}) {
  const user = JSON.parse(localStorage.getItem('user') ?? 'null')
  const [selected, setSelected] = useState(() =>
    user ? getUserRating(venueId, user.name) : 0,
  )
  const [saved, setSaved] = useState(false)

  if (!user) return null

  return (
    <div className="mt-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setSelected(star)
              setSaved(false)
            }}
            className={`text-2xl leading-none ${
              star <= selected ? 'text-(--lagoon)' : 'text-(--line)'
            }`}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          if (selected < 1) return
          saveRating(venueId, user.name, selected)
          onRated()
          setSaved(true)
        }}
        disabled={selected < 1}
        className="mt-2 rounded-lg bg-(--lagoon) px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-(--lagoon-deep) disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit rating
      </button>

      {saved && (
        <p className="mt-2 text-sm font-medium text-emerald-700">
          Thanks! Your rating has been saved.
        </p>
      )}
    </div>
  )
}
