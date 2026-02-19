import type { ForecastResponse } from '../api/openMeteo'
import { formatHourLabel, formatPercent, formatTemp } from '../utils/format'
import { getWeatherCode } from '../utils/weatherCodes'
import { iconColor, iconSvg } from './icons'

export function renderHourly(forecast: ForecastResponse): void {
  const container = document.querySelector<HTMLDivElement>('#hourly-list')
  if (!container) return
  container.innerHTML = ''

  const { hourly, timezone } = forecast
  const nowIndex = hourly.time.findIndex((time) => new Date(time) > new Date())
  const start = nowIndex >= 0 ? nowIndex : 0
  const end = Math.min(start + 24, hourly.time.length)

  for (let i = start; i < end; i += 1) {
    const wrapper = document.createElement('div')
    wrapper.className = 'hourly-item'

    const code = getWeatherCode(hourly.weather_code[i])

    wrapper.innerHTML = `
      <div>
        <p class="hour">${formatHourLabel(hourly.time[i], timezone)}</p>
        <p class="desc"><span class="icon" style="color:${iconColor(code.icon)}">${iconSvg(code.icon)}</span>${code.label}</p>
      </div>
      <div class="hourly-meta">
        <span>${formatTemp(hourly.temperature_2m[i])}</span>
        <span>${formatPercent(hourly.precipitation_probability?.[i])}</span>
      </div>
    `
    container.appendChild(wrapper)
  }
}
