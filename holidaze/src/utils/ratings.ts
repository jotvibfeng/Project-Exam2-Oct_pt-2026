interface StoredRating {
  venueId: string
  userName: string
  rating: number
}

const RATINGS_KEY = 'holidaze_ratings'

export function getRatings(): StoredRating[] {
  return JSON.parse(localStorage.getItem(RATINGS_KEY) ?? '[]')
}

export function saveRating(venueId: string, userName: string, rating: number) {
  const ratings = getRatings().filter(
    (r) => !(r.venueId === venueId && r.userName === userName),
  )
  ratings.push({ venueId, userName, rating })
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

export function getAverageRating(venueId: string, fallback: number): number {
  const ratings = getRatings().filter((r) => r.venueId === venueId)
  if (ratings.length === 0) return fallback
  const total = ratings.reduce((sum, r) => sum + r.rating, 0)
  return total / ratings.length
}

export function getUserRating(venueId: string, userName: string): number {
  const existing = getRatings().find(
    (r) => r.venueId === venueId && r.userName === userName,
  )
  return existing?.rating ?? 0
}
