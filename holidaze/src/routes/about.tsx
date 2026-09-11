import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-10 sm:py-16">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="island-kicker mb-3">Stay somewhere memorable</p>
          <h1 className="display-title max-w-2xl text-4xl font-bold leading-tight text-(--sea-ink) sm:text-5xl lg:text-6xl">
            Travel better with Holidaze.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-(--sea-ink-soft) sm:text-lg">
            Holidaze makes it simple to discover welcoming venues, compare the
            details that matter, and book a place that fits your next trip.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-(--lagoon) px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-(--lagoon-deep)"
              style={{ color: 'white' }}
            >
              Explore venues
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-(--line) bg-(--surface) px-5 py-3 text-sm font-semibold text-(--sea-ink) no-underline transition hover:bg-(--link-bg-hover)"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="island-shell order-1 overflow-hidden rounded-3xl p-2 lg:order-2">
          <div className="relative aspect-4/3 overflow-hidden rounded-[1.35rem]">
            <img
              src="/pexels-asadphoto-9470485.jpg"
              alt="A bright coastal destination viewed from above"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/45 p-4 text-white backdrop-blur-sm sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="text-sm font-semibold sm:text-base">
                Find your next place to pause.
              </p>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">
                Search stays made for weekends away and longer escapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3">
        <article className="island-shell rounded-2xl p-5 sm:p-6">
          <p className="text-2xl font-bold text-(--lagoon-deep)">01</p>
          <h2 className="mt-4 text-lg font-semibold text-(--sea-ink)">
            Discover
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--sea-ink-soft)">
            Browse a growing collection of venues and narrow your search by the
            details you care about.
          </p>
        </article>
        <article className="island-shell rounded-2xl p-5 sm:p-6">
          <p className="text-2xl font-bold text-(--lagoon-deep)">02</p>
          <h2 className="mt-4 text-lg font-semibold text-(--sea-ink)">
            Compare
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--sea-ink-soft)">
            See prices, ratings, amenities, images, and guest capacity before
            you make a decision.
          </p>
        </article>
        <article className="island-shell rounded-2xl p-5 sm:p-6">
          <p className="text-2xl font-bold text-(--lagoon-deep)">03</p>
          <h2 className="mt-4 text-lg font-semibold text-(--sea-ink)">Book</h2>
          <p className="mt-2 text-sm leading-6 text-(--sea-ink-soft)">
            Choose your dates, tell us how many guests are travelling, and keep
            your bookings together in your profile.
          </p>
        </article>
      </section>

      <section className="mt-12 border-t border-(--line) pt-8 text-center sm:mt-16 sm:pt-10">
        <p className="island-kicker">Your next stay starts here</p>
        <h2 className="display-title mt-2 text-3xl font-bold text-(--sea-ink) sm:text-4xl">
          Make room for a little more away.
        </h2>
      </section>
    </main>
  )
}
