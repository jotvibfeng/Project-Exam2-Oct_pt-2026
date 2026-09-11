import { useState } from 'react'
import { updateVenueProfileAvatar } from '#/services/api.services'

export default function profileHeader({
  profile,
  user,
  token,
  onAvatarUpdated,
}: {
  profile: any
  user: any
  token: string
  onAvatarUpdated: (updater: (p: any) => any) => void
}) {
  const [editingAvatar, setEditingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar?.url ?? '')
  const [avatarError, setAvatarError] = useState<string | null>(null)

  async function saveAvatar() {
    try {
      setAvatarError(null)
      const updated = await updateVenueProfileAvatar(
        user.name,
        avatarUrl,
        token,
      )
      onAvatarUpdated((p) => ({ ...p, avatar: updated.avatar }))
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

  return (
    <>
      <div className="bg-(--surface) rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 ">
        <img
          src={profile.avatar?.url || '/placeholder.png'}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-(--lagoon) shrink-0"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-(--sea-ink)">
              {profile.name}
            </h1>
            {profile.venueManager && (
              <span className="self-center sm:self-auto text-xs bg-(--lagoon) text-white px-2.5 py-0.5 rounded-full font-medium">
                Venue Manager
              </span>
            )}
          </div>
          <p className="text-sm text-var(--sea-ink-soft) mb-4">
            {profile.email}
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
    </>
  )
}
