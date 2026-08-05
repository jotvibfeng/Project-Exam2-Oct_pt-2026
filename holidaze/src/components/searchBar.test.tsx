import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { useNavigate } from '@tanstack/react-router'
import SearchBar from './searchBar'

// mock router and API — SearchBar won't work without these
vi.mock('@tanstack/react-router', () => ({ useNavigate: vi.fn() }))
vi.mock('#/services/api.services', () => ({
  getVenues: vi.fn().mockResolvedValue([
    { id: '1', name: 'Venue One' },
    { id: '2', name: 'Venue Two' },
  ]),
}))

describe('SearchBar', () => {
  afterEach(cleanup)
  it('renders the search input', () => {
    vi.mocked(useNavigate).mockReturnValue(vi.fn())
    render(<SearchBar />)
    expect(screen.getByPlaceholderText('Search venues…')).toBeDefined()
  })

  it('shows suggestions when typing', async () => {
    vi.mocked(useNavigate).mockReturnValue(vi.fn())
    render(<SearchBar />)
    await act(async () => {}) // flush getVenues promise so allVenues is populated
    fireEvent.change(screen.getByPlaceholderText('Search venues…'), {
      target: { value: 'Venue' },
    })
    expect(await screen.findByText('Venue One')).toBeDefined()
  })
})
