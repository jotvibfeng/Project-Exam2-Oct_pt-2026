import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  getVenueProfile,
  getVenueBookings,
  updateVenueProfileAvatar,
} from '#/services/api.services'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')
  const token = localStorage.getItem('token') ?? ''

  const [venueProfile, setVenueProfile] = useState<any>(null)
  const [venueBookings, setVenueBookings] = useState<any[]>([])
  const [editingAvatar, setEditingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarError, setAvatarError] = useState<string | null>(null)

  useEffect(() => {
    if (!user.name || !token) {
      navigate({ to: '/login' })
      return
    }
    getVenueProfile(user.name, token).then((data) => {
      setVenueProfile(data)
      setAvatarUrl(data.avatar?.url ?? '')
    })
    getVenueBookings(user.name, token).then((data) => setVenueBookings(data))
  }, [])

  async function saveAvatar() {
    try {
      setAvatarError(null)
      const updated = await updateVenueProfileAvatar(
        user.name,
        avatarUrl,
        token,
      )
      setVenueProfile((p: any) => ({ ...p, avatar: updated.avatar }))
      const updatedUser = { ...user, avatar: updated.avatar }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('storage'))
      setEditingAvatar(false)
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Failed to update avatar',
      )
    }
  }

  if (!venueProfile)
    return (
      <main className="page-wrap px-4 py-12 flex items-center justify-center">
        <p className="text-var(--sea-ink-soft) animate-pulse text-lg">
          Loading profile…
        </p>
      </main>
    )

  return (
    <main className="page-wrap px-4 py-12 max-w-3xl mx-auto">
      <div className="bg-(--surface) rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 ">
        <img
          src={venueProfile.avatar?.url || '/placeholder.png'}
          alt={venueProfile.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-(--lagoon) shrink-0"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-(--sea-ink)">
              {venueProfile.name}
            </h1>
            {venueProfile.venueManager && (
              <span className="self-center sm:self-auto text-xs bg-(--lagoon) text-white px-2.5 py-0.5 rounded-full font-medium">
                Venue Manager
              </span>
            )}
          </div>
          <p className="text-sm text-var(--sea-ink-soft) mb-4">
            {venueProfile.email}
          </p>
          <button
            onClick={() => setEditingAvatar(!editingAvatar)}
            className="px-4 py-2 cursor-pointer bg-(--sea-ink) text-white text-sm rounded-lg hover:bg-(--sea-ink-soft) transition"
          >
            Edit Avatar
          </button>
        </div>
      </div>

      {editingAvatar && (
        <div className="bg-(--surface-strong) border border-(--line) rounded-2xl p-6 mt-4 shadow-sm">
          <label className="block text-sm font-medium text-(--sea-ink) mb-2">
            Avatar URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-2 rounded-lg border border-(--line) bg-white text-(--sea-ink) focus:outline-none focus:ring-2 focus:ring-(--lagoon)"
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={saveAvatar}
              className="px-4 py-2 bg-(--lagoon) text-white text-sm rounded-lg hover:bg-(--lagoon-deep) transition cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={() => setEditingAvatar(false)}
              className="px-4 py-2 bg-(--line) text-(--sea-ink) text-sm rounded-lg hover:opacity-80 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
          {avatarError && (
            <p className="mt-3 text-sm text-red-600">{avatarError}</p>
          )}
        </div>
      )}

      {venueProfile.venueManager && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-(--sea-ink) mb-4">My Venues</h2>
          <button className="px-2 py-2 bg-(--lagoon) text-white text-sm rounded-lg hover:bg-(--lagoon-deep) transition cursor-pointer">
            create Venue
          </button>
          <p className="text-(--sea-ink-soft) text-sm">
            No venues created yet.
          </p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold text-(--sea-ink) mb-4">My Bookings</h2>
        {venueBookings.length === 0 ? (
          <p className="text-(--sea-ink-soft) text-sm">No bookings yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {venueBookings.map((booking) => (
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
    </main>
  )
}
