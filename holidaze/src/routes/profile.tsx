import { createFileRoute } from '@tanstack/react-router'
import ProfileHeader from '#/components/profileHeader.tsx'
import MyVenues from '#/components/myVenues.tsx'
import MyBookings from '#/components/myBooking.tsx'
import { useProfileData } from '#/hooks/userProfileData.ts'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')
  const token = localStorage.getItem('token') ?? ''
  const { venueProfile, setVenueProfile, venueBookings } = useProfileData(
    user,
    token,
  )

  if (!venueProfile)
    return (
      <main className="page-wrap px-4 py-12 flex items-center justify-center">
        <p className="text-var(--sea-ink-soft) animate-pulse text-lg">
          Loading profile…
        </p>
      </main>
    )

  return (
    <main className="page-wrap px-4 py-12 max-w-3xl mx-auto">
      <ProfileHeader
        profile={venueProfile}
        user={user}
        token={token}
        onAvatarUpdated={setVenueProfile}
      />
      {venueProfile.venueManager && (
        <MyVenues profile={venueProfile} onProfileChange={setVenueProfile} />
      )}
      <MyBookings bookings={venueBookings} />
    </main>
  )
}
