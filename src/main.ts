import './styles.css'
import { fetchForecast } from './api/openMeteo'
import { geocodeCity } from './api/geocode'
import { renderCurrent } from './ui/renderCurrent'
import { renderHourly } from './ui/renderHourly'
import { renderDaily } from './ui/renderDaily'
import { store, type LocationResult, type UnitPreference } from './state/store'

const statusSection = document.querySelector<HTMLDivElement>('#status-section')
const statusText = document.querySelector<HTMLParagraphElement>('#status-text')
const retryBtn = document.querySelector<HTMLButtonElement>('#retry-btn')
const btnLocation = document.querySelector<HTMLButtonElement>('#btn-location')
const cityInput = document.querySelector<HTMLInputElement>('#city-input')
const searchResults = document.querySelector<HTMLDivElement>('#search-results')
const quickActions = document.querySelector<HTMLDivElement>('#quick-actions')
const refreshBtn = document.querySelector<HTMLButtonElement>('#refresh-btn')
const unitToggle = document.querySelector<HTMLDivElement>('#unit-toggle')
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle')

let lastRequest: LocationResult | null = null
let searchTimeout: number | null = null
let unitPreference: UnitPreference | null = null
let currentUnit: UnitPreference = 'c'
let currentTheme: 'system' | 'light' | 'dark' = 'system'

const FAHRENHEIT_COUNTRIES = new Set([
  'United States',
  'United States of America',
  'USA',
  'Liberia',
  'Myanmar'
])

function guessUnitFromLocale(): UnitPreference {
  const lang = navigator.language || ''
  return lang.endsWith('-US') ? 'f' : 'c'
}

function guessUnitForLocation(location: LocationResult | null): UnitPreference {
  if (location?.country && FAHRENHEIT_COUNTRIES.has(location.country)) return 'f'
  return guessUnitFromLocale()
}

function resolveUnit(location: LocationResult | null): UnitPreference {
  return unitPreference ?? guessUnitForLocation(location)
}

function updateUnitToggle(unit: UnitPreference) {
  if (!unitToggle) return
  const buttons = unitToggle.querySelectorAll<HTMLButtonElement>('button')
  buttons.forEach((btn) => {
    const isActive = btn.dataset.unit === unit
    btn.classList.toggle('active', isActive)
  })
}

function applyTheme(theme: 'system' | 'light' | 'dark') {
  currentTheme = theme
  const root = document.documentElement
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme
  root.dataset.theme = resolved
  if (themeToggle) {
    const label = theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'
    themeToggle.textContent = `Theme: ${label}`
  }
}

function loadThemePreference() {
  const saved = localStorage.getItem('weather:theme')
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    applyTheme(saved)
  } else {
    applyTheme('system')
  }
}

function saveThemePreference(theme: 'system' | 'light' | 'dark') {
  localStorage.setItem('weather:theme', theme)
}

function setStatus(message: string, showRetry = false) {
  if (!statusSection || !statusText || !retryBtn) return
  statusSection.classList.remove('hidden')
  statusText.textContent = message
  retryBtn.hidden = !showRetry
  if (refreshBtn) refreshBtn.disabled = true
}

function hideStatus() {
  if (!statusSection) return
  statusSection.classList.add('hidden')
  if (refreshBtn) refreshBtn.disabled = false
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
    currentUnit = resolveUnit(location)
    updateUnitToggle(currentUnit)
    const forecast = await fetchForecast(
      location.latitude,
      location.longitude,
      currentUnit === 'f' ? 'fahrenheit' : 'celsius'
    )
    renderCurrent(forecast, location, currentUnit)
    renderHourly(forecast, currentUnit)
    renderDaily(forecast, currentUnit)
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

refreshBtn?.addEventListener('click', () => {
  if (lastRequest) loadForecast(lastRequest)
})

unitToggle?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const unit = target.getAttribute('data-unit')
  if (unit === 'c' || unit === 'f') {
    unitPreference = unit
    store.setUnitPreference(unit)
    if (lastRequest) loadForecast(lastRequest)
  }
})

themeToggle?.addEventListener('click', () => {
  const next = currentTheme === 'system' ? 'dark' : currentTheme === 'dark' ? 'light' : 'system'
  applyTheme(next)
  saveThemePreference(next)
})

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (currentTheme === 'system') applyTheme('system')
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

unitPreference = store.loadUnitPreference()
currentUnit = resolveUnit(null)
updateUnitToggle(currentUnit)
loadThemePreference()

const cached = store.loadFromStorage()
if (cached) {
  renderQuickActions(cached)
  loadForecast(cached)
} else {
  setStatus('Choose a location to get started.', false)
}
