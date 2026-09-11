import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVenue, deleteVenue } from '#/services/api.services'
import { useState } from 'react'

interface EditVenueProps {
  venue: any
  onClose: () => void
  onUpdated: (venue: any) => void
  onDeleted: (id: string) => void
}

export default function EditVenue({
  venue,
  onClose,
  onUpdated,
  onDeleted,
}: EditVenueProps) {
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token') || ''

  const [name, setName] = useState(venue.name)
  const [description, setDescription] = useState(venue.description)
  const [price, setPrice] = useState(venue.price)
  const [maxGuests, setMaxGuests] = useState(venue.maxGuests)
  const [media, setMedia] = useState(venue.media?.[0]?.url ?? '')
  const [wifi, setWifi] = useState(venue.meta?.wifi ?? false)
  const [parking, setParking] = useState(venue.meta?.parking ?? false)
  const [breakfast, setBreakfast] = useState(venue.meta?.breakfast ?? false)
  const [pets, setPets] = useState(venue.meta?.pets ?? false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    mutate: update,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
  } = useMutation({
    mutationFn: () =>
      updateVenue(
        venue.id,
        {
          name,
          description,
          price,
          maxGuests,
          media: media ? [{ url: media, alt: '' }] : [],
          meta: { wifi, parking, breakfast, pets },
        },
        token,
      ),
    onSuccess: async (updated) => {
      onUpdated(updated)
      await queryClient.invalidateQueries({ queryKey: ['venues'] })
      await queryClient.invalidateQueries({ queryKey: ['venue', updated.id] })
      onClose()
    },
  })

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteVenue(venue.id, token),
    onSuccess: async () => {
      onDeleted(venue.id)
      await queryClient.invalidateQueries({ queryKey: ['venues'] })
      await queryClient.invalidateQueries({ queryKey: ['venue', venue.id] })
      onClose()
    },
  })

  const inputClass =
    'w-full px-4 py-2 rounded-lg border border-(--line) bg-white text-(--sea-ink) focus:outline-none focus:ring-2 focus:ring-(--lagoon)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-(--surface) rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--sea-ink)">Edit Venue</h2>
          <button
            onClick={onClose}
            className="text-(--sea-ink-soft) hover:text-(--sea-ink) transition text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-(--sea-ink) mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--sea-ink) mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--sea-ink) mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
                <input
                  type="checkbox"
                  checked={wifi}
                  onChange={(e) => setWifi(e.target.checked)}
                  className="h-4 w-4 accent-(--lagoon)"
                />
                WiFi
              </label>
              <label className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={(e) => setParking(e.target.checked)}
                  className="h-4 w-4 accent-(--lagoon)"
                />
                Parking
              </label>
              <label className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
                <input
                  type="checkbox"
                  checked={breakfast}
                  onChange={(e) => setBreakfast(e.target.checked)}
                  className="h-4 w-4 accent-(--lagoon)"
                />
                Breakfast
              </label>
              <label className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
                <input
                  type="checkbox"
                  checked={pets}
                  onChange={(e) => setPets(e.target.checked)}
                  className="h-4 w-4 accent-(--lagoon)"
                />
                Pets allowed
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--sea-ink) mb-1">
                Price / night ($)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--sea-ink) mb-1">
                Max Guests
              </label>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--sea-ink) mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {updateError && (
          <p className="mt-3 text-sm text-red-600">
            Failed to update. Please try again.
          </p>
        )}
        {updateSuccess && (
          <p className="mt-3 text-sm text-green-600">
            Venue updated successfully!
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => update()}
            disabled={isUpdating || updateSuccess}
            className="flex-1 py-2 bg-(--lagoon) text-white text-sm font-medium rounded-lg hover:bg-(--lagoon-deep) transition disabled:opacity-50 cursor-pointer"
          >
            {isUpdating ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-(--line) text-(--sea-ink) text-sm rounded-lg hover:opacity-80 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-(--line)">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              Delete Venue
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-red-600 text-center font-medium">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => remove()}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 bg-(--line) text-(--sea-ink) text-sm rounded-lg hover:opacity-80 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
