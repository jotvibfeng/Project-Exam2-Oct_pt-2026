import { useMutation } from '@tanstack/react-query'
import { createVenue } from '#/services/api.services'
import { useState } from 'react'

export default function CreateVenue({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [maxGuests, setMaxGuests] = useState(1)
  const [media, setMedia] = useState('')

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
          meta: { wifi: false, parking: false, breakfast: false, pets: false },
        },
        token,
      ),
    onSuccess: () => setTimeout(onClose, 2000),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="island-shell rounded-2xl p-6 w-full max-w-md">
        <h2>Create a new venue</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max Guests"
          value={maxGuests}
          onChange={(e) => setMaxGuests(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Media URL"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
        />

        {isError && (
          <p className="text-red-500">
            Error creating venue. Please try again.
          </p>
        )}
        {isSuccess && (
          <p className="text-green-500">Venue created successfully!</p>
        )}

        <button onClick={() => mutate()} disabled={isPending}>
          {isPending ? 'Creating…' : 'Create Venue'}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
