export type LocationResult = {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  timezone?: string
}

export type UnitPreference = 'c' | 'f'

type StoreState = {
  location: LocationResult | null
  unitPreference: UnitPreference | null
}

const STORAGE_KEY = 'weather:lastLocation'
const UNIT_KEY = 'weather:unitPreference'

const state: StoreState = {
  location: null,
  unitPreference: null
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
  setUnitPreference: (unit: UnitPreference | null) => {
    state.unitPreference = unit
    if (unit) {
      localStorage.setItem(UNIT_KEY, unit)
    } else {
      localStorage.removeItem(UNIT_KEY)
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
  },
  loadUnitPreference: () => {
    const raw = localStorage.getItem(UNIT_KEY)
    if (raw === 'c' || raw === 'f') {
      state.unitPreference = raw
      return raw
    }
    localStorage.removeItem(UNIT_KEY)
    return null
  }
}
