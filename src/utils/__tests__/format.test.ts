import { describe, expect, it } from 'vitest'
import { formatDayLabel, formatHourLabel } from '../format'

const timezone = 'UTC'

describe('formatting', () => {
  it('formats hour label', () => {
    const label = formatHourLabel('2024-01-01T15:00:00Z', timezone)
    expect(label).toContain('3')
    expect(label.toUpperCase()).toContain('PM')
  })

  it('formats day label', () => {
    const label = formatDayLabel('2024-01-01T00:00:00Z', timezone)
    expect(label).toContain('Jan')
  })
})
