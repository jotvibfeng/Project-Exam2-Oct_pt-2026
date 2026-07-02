import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { getVenues } from '#/services/api.services'
import type { Venues } from '#/services/api.services'
import { Search } from '@digdir/designsystemet-react'
import { Search as SearchIcon, X } from 'lucide-react'

function getScheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [allVenues, setAllVenues] = useState<Venues[]>([])
  const [suggestions, setSuggestions] = useState<Venues[]>([])
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(getScheme)
  const navigate = useNavigate()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getVenues().then(setAllVenues).catch(console.error)
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => setColorScheme(getScheme()))
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    if (val.trim()) {
      const q = val.trim().toLowerCase()
      setSuggestions(
        allVenues.filter((v) => v.name.toLowerCase().includes(q)).slice(0, 6),
      )
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (venue: Venues) => {
    navigate({ to: '/venues', search: { id: venue.id } })
    setSearchTerm('')
    setSuggestions([])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      handleSelect(suggestions[0])
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="mx-auto mb-8 max-w-md"
      style={{ position: 'relative' }}
    >
      <form
        onSubmit={handleSearch}
        data-color-scheme={colorScheme}
        style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        <Search style={{ flex: 1 }}>
          <input
            type="text"
            className="ds-input"
            aria-label="Search venues"
            placeholder="Search venues…"
            value={searchTerm}
            onChange={handleChange}
            autoComplete="off"
          />
          <Search.Button style={{ background: 'var(--lagoon)', color: '#fff' }}>
            <SearchIcon size={16} strokeWidth={2.5} />
          </Search.Button>
        </Search>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setSuggestions([])
            }}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '3rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--sea-ink-soft)',
              padding: '0.25rem',
            }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </form>

      {suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((venue) => (
            <li key={venue.id}>
              <button type="button" onClick={() => handleSelect(venue)}>
                {venue.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
