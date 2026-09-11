import { useQuery } from '@tanstack/react-query'
import { getVenues } from '#/services/api.services'
import { Link } from '@tanstack/react-router'
import LoadingBar from './loadingBar'
import { getAverageRating } from '#/utils/ratings'

const rating = (score: number) => {
  if (score >= 4.5) {
    return '5/5 '
  } else if (score >= 3.5) {
    return '4/5 '
  } else if (score >= 2.5) {
    return '3/5 '
  } else if (score >= 1.5) {
    return '2/5 '
  } else {
    return '1/5 '
  }
}

export function ProductList() {
  const {
    data: venues,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const data = await getVenues()
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return data
    },
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

      {isPending ? (
        <LoadingBar />
      ) : isError ? (
        <p className="text-center text-red-500 animate-pulse">
          Could not find the venues. Please try again later.
        </p>
      ) : venues.length === 0 ? (
        <p className="text-center text-(--sea-ink-soft) animate-pulse">
          No venues available.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const displayRating = getAverageRating(venue.id, venue.rating)
            return (
              <Link
                key={venue.id}
                to="/venues"
                search={{ id: venue.id }}
                className="feature-card island-shell flex flex-col overflow-hidden rounded-2xl border border-(--line) no-underline transition hover:-translate-y-1 hover:shadow-lg"
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
                      {rating(displayRating)}
                    </span>
                    <span>·</span>
                    <span>{venue.maxGuests} guests</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-(--line)">
                    <span className="font-semibold text-(--sea-ink)">
                      <span className="text-(--lagoon-deep)">
                        ${venue.price}
                      </span>
                      <span className="text-xs font-normal text-(--sea-ink-soft)">
                        {' '}
                        / night
                      </span>
                    </span>
                    <span className="rounded-lg bg-(--lagoon) px-3 py-1.5 text-sm font-semibold text-white">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
