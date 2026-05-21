import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getVenues } from '#/services/api.services'
import type { Venues } from '#/services/api.services'

export const Route = createFileRoute('/')({ component: App })

// eslint-disable-next-line no-shadow
const rating = (rating: number) => {
  if (rating >= 4.5) {
    return 'Excellent'
  } else if (rating >= 3.5) {
    return 'Good'
  } else if (rating >= 2.5) {
    return 'Average'
  } else if (rating >= 1.5) {
    return 'Poor'
  } else {
    return 'Terrible'
  }
}

function App() {
  const [venues, setVenues] = useState<Venues[]>([])

  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues()
        setVenues(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchVenues()
  }, [])

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="island-headline mb-4 text-center">Welcome to Holidaze</h1>
      {venues.map((venue) => (
        <div key={venue.id}>
          <h2>{venue.name}</h2>
          {venue.media[0] && (
            <img src={venue.media[0].url} alt={venue.media[0].alt} />
          )}
          <p>${venue.price}</p>
          <p>{rating(venue.rating)}</p>
          <p>{venue.maxGuests} guests</p>
          <Link to="/venues" params={{ id: venue.id }}>
            View Details
          </Link>
        </div>
      ))}
    </main>
  )
}
