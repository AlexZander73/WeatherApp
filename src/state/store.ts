export type LocationResult = {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  timezone?: string
}

type StoreState = {
  location: LocationResult | null
}

const STORAGE_KEY = 'weather:lastLocation'

const state: StoreState = {
  location: null
}

export const store = {
  getState: () => ({ ...state }),
  setLocation: (loc: LocationResult | null) => {
    state.location = loc
    if (loc) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  },
  loadFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as LocationResult
      state.location = parsed
      return parsed
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  }
}
