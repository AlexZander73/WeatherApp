export function formatTemp(
  value: number | null | undefined,
  unit: 'c' | 'f'
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--'
  return `${Math.round(value)}°${unit.toUpperCase()}`
}

export function formatWind(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--'
  return `${Math.round(value)} mph`
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '--'
  return `${Math.round(value)}%`
}

export function formatHourLabel(iso: string, timezone: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone
  }).format(date)
}

export function formatDayLabel(iso: string, timezone: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone
  }).format(date)
}

export function formatUpdatedLabel(iso: string, timezone: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
    timeZoneName: 'short'
  }).format(date)
}
