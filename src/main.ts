import './styles.css'
import { fetchForecast } from './api/openMeteo'
import { geocodeCity } from './api/geocode'
import { renderCurrent } from './ui/renderCurrent'
import { renderHourly } from './ui/renderHourly'
import { renderDaily } from './ui/renderDaily'
import { store, type LocationResult } from './state/store'

const statusSection = document.querySelector<HTMLDivElement>('#status-section')
const statusText = document.querySelector<HTMLParagraphElement>('#status-text')
const retryBtn = document.querySelector<HTMLButtonElement>('#retry-btn')
const btnLocation = document.querySelector<HTMLButtonElement>('#btn-location')
const cityInput = document.querySelector<HTMLInputElement>('#city-input')
const searchResults = document.querySelector<HTMLDivElement>('#search-results')
const quickActions = document.querySelector<HTMLDivElement>('#quick-actions')

let lastRequest: LocationResult | null = null
let searchTimeout: number | null = null

function setStatus(message: string, showRetry = false) {
  if (!statusSection || !statusText || !retryBtn) return
  statusSection.classList.remove('hidden')
  statusText.textContent = message
  retryBtn.hidden = !showRetry
}

function hideStatus() {
  if (!statusSection) return
  statusSection.classList.add('hidden')
}

function renderQuickActions(location: LocationResult | null) {
  if (!quickActions) return
  quickActions.innerHTML = ''
  if (!location) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'chip'
  button.textContent = `Use last: ${location.name}`
  button.addEventListener('click', async () => {
    await loadForecast(location)
  })
  quickActions.appendChild(button)
}

async function loadForecast(location: LocationResult) {
  try {
    lastRequest = location
    setStatus('Loading forecast...')
    const forecast = await fetchForecast(location.latitude, location.longitude)
    renderCurrent(forecast, location)
    renderHourly(forecast)
    renderDaily(forecast)
    store.setLocation({ ...location, timezone: forecast.timezone })
    renderQuickActions({ ...location, timezone: forecast.timezone })
    hideStatus()
  } catch (err) {
    console.error(err)
    setStatus('Unable to load forecast. Check your connection and try again.', true)
  }
}

async function handleLocationClick() {
  if (!navigator.geolocation) {
    setStatus('Geolocation is not supported in this browser.', false)
    return
  }

  setStatus('Requesting location...')
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const location: LocationResult = {
        name: 'My location',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }
      await loadForecast(location)
    },
    () => {
      setStatus('Location permission denied. Search for a city instead.', false)
    },
    { enableHighAccuracy: false, timeout: 10000 }
  )
}

function renderSearchResults(results: LocationResult[]) {
  if (!searchResults) return
  searchResults.innerHTML = ''
  if (!results.length) {
    searchResults.classList.remove('open')
    return
  }

  results.forEach((loc) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'search-item'
    button.textContent = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}${
      loc.country ? `, ${loc.country}` : ''
    }`
    button.addEventListener('click', async () => {
      renderSearchResults([])
      if (cityInput) cityInput.value = button.textContent ?? ''
      await loadForecast(loc)
    })
    searchResults.appendChild(button)
  })

  searchResults.classList.add('open')
}

async function handleSearchInput(value: string) {
  if (value.length < 3) {
    renderSearchResults([])
    return
  }

  try {
    const results = await geocodeCity(value)
    renderSearchResults(results)
  } catch (err) {
    console.error(err)
  }
}

retryBtn?.addEventListener('click', () => {
  if (lastRequest) loadForecast(lastRequest)
})

btnLocation?.addEventListener('click', handleLocationClick)

cityInput?.addEventListener('input', (event) => {
  const value = (event.target as HTMLInputElement).value
  if (searchTimeout) window.clearTimeout(searchTimeout)
  searchTimeout = window.setTimeout(() => handleSearchInput(value.trim()), 250)
})

window.addEventListener('click', (event) => {
  if (!searchResults || !cityInput) return
  if (!searchResults.contains(event.target as Node) && event.target !== cityInput) {
    searchResults.classList.remove('open')
  }
})

const cached = store.loadFromStorage()
if (cached) {
  renderQuickActions(cached)
  loadForecast(cached)
} else {
  setStatus('Choose a location to get started.', false)
}
