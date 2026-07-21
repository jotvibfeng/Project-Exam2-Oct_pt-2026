import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVenueById } from '#/services/api.services'

export default function VenuePage({ id }: { id?: string }) {
  const [activeImg, setActiveImg] = useState(0)
  const {
    data: venue,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id!),
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

  if (isPending)
    return (
      <main className="page-wrap px-4 py-20 text-center">
        <p className="animate-pulse text-(--sea-ink-soft)">Loading venue…</p>
      </main>
    )

  if (isError)
    return (
      <main className="page-wrap px-4 py-20 text-center">
        <p className="text-(--sea-ink-soft)">Could not load venue.</p>
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

  return (
    <main className="page-wrap px-4 pb-20 pt-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-3 text-sm text-(--sea-ink-soft) no-underline hover:text-(--sea-ink) transition"
      >
        ← Back to venues
      </Link>

      {/* Image gallery */}
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
        {/* Left: details */}
        <div>
          <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
            {venue.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-(--sea-ink-soft)">
            <span className="flex items-center gap-1">
              <span className="text-(--lagoon)">★</span>
              {venue.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>Up to {venue.maxGuests} guests</span>
          </div>

          {venue.description && (
            <p className="mt-6 leading-relaxed text-(--sea-ink-soft)">
              {venue.description}
            </p>
          )}

          {/* Amenities */}
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

        <div className="island-shell rounded-2xl border border-(--line) p-6 h-fit">
          <div className="mb-4">
            <span className="text-3xl font-bold text-(--sea-ink)">
              ${venue.price}
            </span>
            <span className="text-sm text-(--sea-ink-soft)"> / night</span>
          </div>
          <button className="w-full rounded-xl bg-(--lagoon) py-3 text-sm font-semibold text-white hover:bg-(--lagoon-deep) transition cursor-pointer">
            Book Now
          </button>
          <p className="mt-3 text-center text-xs text-(--sea-ink-soft)">
            You won't be charged yet
          </p>
        </div>
      </div>
    </main>
  )
}
