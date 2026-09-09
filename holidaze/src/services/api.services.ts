const API_BASE = 'https://v2.api.noroff.dev/holidaze'
const API_KEY = import.meta.env.VITE_API_KEY

interface Media {
  url: string
  alt: string
}

export interface Venues {
  id: string
  name: string
  description: string
  media: Array<Media>
  price: number
  rating: number
  maxGuests: number
  meta: {
    wifi: boolean
    parking: boolean
    breakfast: boolean
    pets: boolean
  }
}

function removeImagePageUrls(venue: Venues): Venues {
  return {
    ...venue,
    media: venue.media.filter((media) => {
      try {
        return new URL(media.url).hostname !== 'ibb.co'
      } catch {
        return false
      }
    }),
  }
}

export async function getVenues(): Promise<Venues[]> {
  const response = await fetch(
    `${API_BASE}/venues?sort=created&sortOrder=desc&limit=100`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
      },
    },
  )
  if (!response.ok) {
    throw new Error('Failed to fetch venues')
  }
  const json = await response.json()
  return json.data.map(removeImagePageUrls)
}

export async function getVenueById(
  id: string,
  token?: string,
): Promise<Venues> {
  const headers: Record<string, string> = {
    'X-Noroff-API-Key': API_KEY,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const response = await fetch(`${API_BASE}/venues/${id}`, { headers })
  if (!response.ok) {
    throw new Error(`Failed to fetch venue with id ${id}`)
  }
  const json = await response.json()
  return removeImagePageUrls(json.data)
}

export async function createVenue(
  venueData: Omit<Venues, 'id'>,
  token: string,
): Promise<Venues> {
  const response = await fetch(`${API_BASE}/venues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venueData),
  })
  if (!response.ok) {
    let message = 'Failed to create venue'
    try {
      const err = await response.json()
      message = err?.errors?.[0]?.message || err?.message || message
    } catch {}
    throw new Error(message)
  }
  const json = await response.json()
  return json.data
}

export async function updateVenue(
  id: string,
  venueData: Partial<Omit<Venues, 'id'>>,
  token: string,
): Promise<Venues> {
  const response = await fetch(`${API_BASE}/venues/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(venueData),
  })
  if (!response.ok) {
    throw new Error(`Failed to update venue with id ${id}`)
  }
  const json = await response.json()
  return json.data
}

export async function deleteVenue(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/venues/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to delete venue with id ${id}`)
  }
}

export async function getVenueProfile(name: string, token: string) {
  const response = await fetch(`${API_BASE}/profiles/${name}?_venues=true`, {
    headers: {
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error('Couldn`t fetch the profile')
  const json = await response.json()
  return json.data
}

export async function getVenueBookings(name: string, token: string) {
  const response = await fetch(
    `${API_BASE}/profiles/${name}/bookings?_venue=true`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.ok) throw new Error("Couldn't fetch the bookings")
  const json = await response.json()
  return json.data
}

export async function updateVenueProfileAvatar(
  name: string,
  avatarUrl: string,
  token: string,
) {
  const response = await fetch(`${API_BASE}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      avatar: { url: avatarUrl, alt: `${name}'s avatar` },
    }),
  })
  if (!response.ok) throw new Error("Couldn't update the profile avatar")
  const json = await response.json()
  return json.data
}

export async function getManagerVenueBooking(name: string, token: string) {
  const response = await fetch(
    `${API_BASE}/profiles/${name}/venues?_bookings=true`,
    {
      headers: {
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${token}`,
      },
    },
  )
  if (!response.ok) throw new Error("Couldn't fetch the manager venue bookings")
  const json = await response.json()
  return json.data
}

export async function createBooking(
  data: {
    venueId: string
    dateFrom: string
    dateTo: string
    guests: number
  },
  token: string,
) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    if (response.status === 409)
      throw new Error(
        'These dates are already booked. Please choose different dates.',
      )
    throw new Error('Could not create booking')
  }
  const json = await response.json()
  return json.data
}
