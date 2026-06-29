import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { getVenues } from '#/services/api.services'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    try {
      const venues = await getVenues()
      const q = searchTerm.trim().toLowerCase()
      const match = venues.find((v) => v.name.toLowerCase().includes(q))
      if (match) {
        navigate({ to: '/venues', search: { id: match.id } })
        setSearchTerm('')
      } else {
        alert('No venues found with that name.')
      }
    } catch (error) {
      console.error('Error searching for venues:', error)
    }
  }

  return (
    <form onSubmit={handleSearch} ref={inputRef} className="flex gap-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for venues…"
        className="w-full rounded-xl border border-(--line) bg-(--surface-strong) px-4 py-2 text-(--sea-ink) outline-none focus:border-(--lagoon) transition"
      />
      <button
        type="submit"
        className="rounded-xl bg-(--lagoon) px-4 py-2 text-sm font-semibold text-white hover:bg-(--lagoon-deep) transition cursor-pointer"
      >
        Search
      </button>
    </form>
  )
}
