import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getVenueProfile, getVenueBookings } from '#/services/api.services'

export function useProfileData(user: any, token: string) {
  const navigate = useNavigate()
  const [venueProfile, setVenueProfile] = useState<any>(null)
  const [venueBookings, setVenueBookings] = useState<any[]>([])

  useEffect(() => {
    if (!user.name || !token) {
      navigate({ to: '/login' })
      return
    }
    getVenueProfile(user.name, token).then(setVenueProfile)
    getVenueBookings(user.name, token)
      .then(setVenueBookings)
      .catch((err) => console.error('bookings error:', err))
  }, [])

  return { venueProfile, setVenueProfile, venueBookings }
}
