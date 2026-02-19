export type ForecastResponse = {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature?: number
    weather_code: number
    wind_speed_10m: number
    precipitation_probability?: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    precipitation_probability?: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    precipitation_probability_max?: number[]
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto'
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch forecast')
  return (await res.json()) as ForecastResponse
}
