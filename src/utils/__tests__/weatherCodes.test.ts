import { describe, expect, it } from 'vitest'
import { getWeatherCode } from '../weatherCodes'

describe('weather codes', () => {
  it('returns known code label', () => {
    expect(getWeatherCode(0).label).toBe('Clear sky')
  })

  it('returns unknown fallback', () => {
    expect(getWeatherCode(999).label).toBe('Unknown')
  })
})
