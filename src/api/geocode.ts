import type { LocationResult } from '../state/store'

export type GeocodeResponse = {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
    timezone?: string
  }>
}

export async function geocodeCity(query: string): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json'
  })
  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to search city')
  const data = (await res.json()) as GeocodeResponse
  return (
    data.results?.map((item) => ({
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      timezone: item.timezone
    })) ?? []
  )
}
