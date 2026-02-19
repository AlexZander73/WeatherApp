import type { ForecastResponse } from '../api/openMeteo'
import { formatDayLabel, formatPercent, formatTemp } from '../utils/format'
import { getWeatherCode } from '../utils/weatherCodes'
import { iconColor, iconSvg } from './icons'

export function renderDaily(forecast: ForecastResponse, unit: 'c' | 'f'): void {
  const container = document.querySelector<HTMLDivElement>('#daily-list')
  if (!container) return
  container.innerHTML = ''

  const { daily, timezone } = forecast

  daily.time.forEach((day, index) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'daily-item'

    const code = getWeatherCode(daily.weather_code[index])

    wrapper.innerHTML = `
      <div>
        <p class="day">${formatDayLabel(day, timezone)}</p>
        <p class="desc"><span class="icon" style="color:${iconColor(code.icon)}">${iconSvg(code.icon)}</span>${code.label}</p>
      </div>
      <div class="daily-meta">
        <span class="high">${formatTemp(daily.temperature_2m_max[index], unit)}</span>
        <span class="low">${formatTemp(daily.temperature_2m_min[index], unit)}</span>
        <span>${formatPercent(daily.precipitation_probability_max?.[index])}</span>
      </div>
    `
    container.appendChild(wrapper)
  })
}
