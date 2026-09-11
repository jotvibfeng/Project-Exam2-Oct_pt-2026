import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVenue } from '#/services/api.services'
import { useState } from 'react'

export default function CreateVenue({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated?: (venue: any) => void
}) {
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [maxGuests, setMaxGuests] = useState(1)
  const [media, setMedia] = useState('')
  const [wifi, setWifi] = useState(false)
  const [parking, setParking] = useState(false)
  const [breakfast, setBreakfast] = useState(false)
  const [pets, setPets] = useState(false)

  const token = localStorage.getItem('token') || ''

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: () =>
      createVenue(
        {
          name,
          description,
          price,
          maxGuests,
          rating: 0,
          media: media ? [{ url: media, alt: '' }] : [],
          meta: { wifi, parking, breakfast, pets },
        },
        token,
      ),
    onSuccess: async (newVenue) => {
      onCreated?.(newVenue)
      await queryClient.invalidateQueries({ queryKey: ['venues'] })
      await queryClient.invalidateQueries({ queryKey: ['venues', newVenue.id] })
      setTimeout(onClose, 1200)
    },
  })

  const inputClass =
    'w-full px-4 py-2 rounded-lg border border-(--line) bg-white text-(--sea-ink) focus:outline-none focus:ring-2 focus:ring-(--lagoon)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-(--surface) rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--sea-ink)">
            Create a New Venue
          </h2>
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
              placeholder="e.g. Seaside Cottage"
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
              placeholder="Describe your venue…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
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

        {isError && (
          <p className="mt-3 text-sm text-red-600">
            Error creating venue. Please try again.
          </p>
        )}
        {isSuccess && (
          <p className="mt-3 text-sm text-green-600">
            Venue created successfully!
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => mutate()}
            disabled={isPending || isSuccess}
            className="flex-1 py-2 bg-(--lagoon) text-white text-sm font-medium rounded-lg hover:bg-(--lagoon-deep) transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Creating…' : 'Create Venue'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-(--line) text-(--sea-ink) text-sm rounded-lg hover:opacity-80 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
