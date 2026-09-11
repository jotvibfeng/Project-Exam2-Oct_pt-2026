import { useState } from 'react'
import CreateVenue from '#/components/createVenue'
import EditVenue from '#/components/editVenue'

export default function MyVenues({
  profile,
  onProfileChange,
}: {
  profile: any
  onProfileChange: (updater: (p: any) => any) => void
}) {
  const [showCreateVenue, setShowCreateVenue] = useState(false)
  const [editingVenue, setEditingVenue] = useState<any>(null)

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-(--sea-ink) mb-4">My Venues</h2>
      <button
        onClick={() => setShowCreateVenue(true)}
        className="px-2 py-2 bg-(--lagoon) text-white text-sm rounded-lg hover:bg-(--lagoon-deep) transition cursor-pointer"
      >
        Create Venue
      </button>

      {showCreateVenue && (
        <CreateVenue
          onClose={() => setShowCreateVenue(false)}
          onCreated={(venue) =>
            onProfileChange((p) => ({
              ...p,
              venues: [venue, ...(p.venues ?? [])],
            }))
          }
        />
      )}

      {editingVenue && (
        <EditVenue
          venue={editingVenue}
          onClose={() => setEditingVenue(null)}
          onUpdated={(updated) =>
            onProfileChange((p) => ({
              ...p,
              venues: p.venues.map((v: any) =>
                v.id === updated.id ? updated : v,
              ),
            }))
          }
          onDeleted={(id) =>
            onProfileChange((p) => ({
              ...p,
              venues: p.venues.filter((v: any) => v.id !== id),
            }))
          }
        />
      )}

      {!profile.venues?.length ? (
        <p className="text-(--sea-ink-soft) text-sm mt-4">
          No venues created yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {profile.venues.map((venue: any) => (
            <li
              key={venue.id}
              className="bg-(--surface) border border-(--line) rounded-2xl p-4 shadow-sm flex items-start justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-(--sea-ink)">{venue.name}</p>
                <p className="text-sm text-(--sea-ink-soft) mt-1">
                  ${venue.price} / night
                </p>
                <p className="text-sm text-(--sea-ink-soft) mt-1">
                  Max Guests: {venue.maxGuests}
                </p>
              </div>
              <button
                onClick={() => setEditingVenue(venue)}
                className="shrink-0 px-3 py-1.5 text-xs bg-(--line) text-(--sea-ink) rounded-lg hover:bg-(--lagoon) hover:text-white transition cursor-pointer"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
