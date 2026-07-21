import { useQuery } from '@tanstack/react-query'
import { getVenues } from '#/services/api.services'
import { Link } from '@tanstack/react-router'



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

export function ProductList() {
  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  })

  return (
    <main className="page-wrap  pb-16 pt-14">
      <div className="mb-10 text-center">
        <p className="island-kicker mb-2">Discover &amp; Book</p>
        <h1 className="display-title text-4xl font-bold  text-(--sea-ink) sm:text-5xl">
          Welcome to Holidaze
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-(--sea-ink-soft)">
          Find your perfect getaway from our curated collection of venues.
        </p>
      </div>

   

      {venues.length === 0 ? (
        <p className="text-center text-(--sea-ink-soft) animate-pulse">
          Loading venues…
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="feature-card island-shell flex flex-col overflow-hidden rounded-2xl border border-(--line) transition"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-(--line)">
                {venue.media[0] ? (
                  <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt || venue.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-(--sea-ink-soft) text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="line-clamp-1 text-lg font-bold text-(--sea-ink)">
                  {venue.name}
                </h2>

                <div className="flex items-center gap-3 text-sm text-(--sea-ink-soft)">
                  <span className="flex items-center gap-1">
                    <span className="text-(--lagoon)">★</span>
                    {rating(venue.rating)}
                  </span>
                  <span>·</span>
                  <span>{venue.maxGuests} guests</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-(--line)">
                  <span className="font-semibold text-(--sea-ink)">
                    <span className="text-(--lagoon-deep)">${venue.price}</span>
                    <span className="text-xs font-normal text-(--sea-ink-soft)">
                      {' '}
                      / night
                    </span>
                  </span>
                  <Link
                    to="/venues"
                    search={{ id: venue.id }}
                    className="rounded-lg bg-(--lagoon) px-3 py-1.5 text-sm font-semibold !text-white no-underline hover:bg-(--lagoon-deep) transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
