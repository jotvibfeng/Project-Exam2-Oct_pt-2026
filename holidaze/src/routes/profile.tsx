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
    const updated = await updateVenueProfileAvatar(user.name, avatarUrl, token)
    setVenueProfile((p: any) => ({ ...p, avatar: updated.avatar }))
    setEditingAvatar(false)
  }

  if (!venueProfile) return <div>Loading...</div>

  return (
    <main className="page-wrap content-center px-4 py-12">
      <div>
        <img
          src={venueProfile.avatar?.url || '/placeholder.png'}
          alt={venueProfile.name}
          className="w-50 h-50 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-semibold">{venueProfile.name}</h1>
          <p className="text-lg font-semibold">{venueProfile.email}</p>
          {venueProfile.venueManager && (
            <span className="text-xs bg-[#2f4858] text-white px-2 py-0.5 rounded mt-1 inline-block">
              Venue Manager
            </span>
          )}
        </div>
        <button
          onClick={() => setEditingAvatar(!editingAvatar)}
          className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {editingAvatar && (
        <div className="bg-white rounded-xl shadow  p-6 mt-4">
          <label className="block text-sm font-medium mb-2">Avatar URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder=""
            className="w-full px-4 py-2 rounded border"
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={saveAvatar}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditingAvatar(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      {venueBookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {venueBookings.map((booking) => (
            <li key={booking.id} className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold">{booking.venue?.name ?? 'Venue'}</p>
              <p className="text-sm text-gray-500">
                {new Date(booking.dateFrom).toLocaleDateString()} →{' '}
                {new Date(booking.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm">Guests: {booking.guests}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
