import { describe, expect, it } from 'vitest'
import { assetUrl } from './assetUrl'

describe('assetUrl', () => {
  it('prefixes paths with the Vite base URL', () => {
    expect(assetUrl('models/ac10.nam')).toContain('models/ac10.nam')
    expect(assetUrl('/inputs/mayer-guitar.wav')).toContain('inputs/mayer-guitar.wav')
  })
})
