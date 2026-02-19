import type { ForecastResponse } from '../api/openMeteo'
import { formatPercent, formatTemp, formatUpdatedLabel, formatWind } from '../utils/format'
import { getWeatherCode } from '../utils/weatherCodes'
import type { LocationResult } from '../state/store'
import { iconColor, iconSvg } from './icons'

export function renderCurrent(
  forecast: ForecastResponse,
  location: LocationResult,
  unit: 'c' | 'f'
): void {
  const label = document.querySelector<HTMLParagraphElement>('#location-label')
  const temp = document.querySelector<HTMLHeadingElement>('#current-temp')
  const desc = document.querySelector<HTMLParagraphElement>('#current-desc')
  const icon = document.querySelector<HTMLSpanElement>('#current-icon')
  const feels = document.querySelector<HTMLElement>('#current-feels')
  const wind = document.querySelector<HTMLElement>('#current-wind')
  const precip = document.querySelector<HTMLElement>('#current-precip')
  const updated = document.querySelector<HTMLElement>('#current-updated')

  if (!label || !temp || !desc || !icon || !feels || !wind || !precip || !updated) return

  const locationLabel = `${location.name}${location.admin1 ? `, ${location.admin1}` : ''}${
    location.country ? `, ${location.country}` : ''
  }`
  const current = forecast.current
  const code = getWeatherCode(current.weather_code)

  label.textContent = locationLabel
  temp.textContent = formatTemp(current.temperature_2m, unit)
  desc.textContent = code.label
  icon.innerHTML = iconSvg(code.icon)
  icon.style.color = iconColor(code.icon)
  feels.textContent = formatTemp(current.apparent_temperature, unit)
  wind.textContent = formatWind(current.wind_speed_10m)
  precip.textContent = formatPercent(current.precipitation_probability)
  updated.textContent = `Last updated: ${formatUpdatedLabel(current.time, forecast.timezone)}`
}
