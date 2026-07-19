import { describe, expect, it } from 'vitest'
import { buildDemoInputs } from './demoInputs'

const BASE = '/shhhred/'
const NAM_DEMO_BASE =
  'https://raw.githubusercontent.com/tone-3000/neural-amp-modeler-wasm/main/ui/public/inputs/'

describe('buildDemoInputs', () => {
  const inputs = buildDemoInputs(BASE)

  it('includes the full NAM guitar and bass library', () => {
    expect(inputs).toHaveLength(34)

    const guitar = inputs.filter((input) => input.genre !== 'bass')
    const bass = inputs.filter((input) => input.genre === 'bass')

    expect(guitar).toHaveLength(28)
    expect(bass).toHaveLength(6)
  })

  it('defaults to Mayer - Guitar', () => {
    const defaultInput = inputs.find((input) => input.default)
    expect(defaultInput?.name).toBe('Mayer - Guitar')
    expect(defaultInput?.url).toBe(`${BASE}inputs/mayer-guitar.wav`)
  })

  it('serves bundled tracks locally and streams the rest from NAM', () => {
    const localTracks = [
      'Mayer - Guitar',
      'Metalcore - Guitar',
      'Fast Thrash - Guitar',
      'Power Thrash - Guitar',
      'Hammer Lead - Guitar',
    ]

    for (const name of localTracks) {
      const input = inputs.find((track) => track.name === name)
      expect(input?.url).toMatch(new RegExp(`^${BASE}inputs/`))
    }

    const remoteInput = inputs.find((track) => track.name === 'Brit - Guitar')
    expect(remoteInput?.url).toBe(
      `${NAM_DEMO_BASE}${encodeURIComponent('Brit - Guitar.wav')}`,
    )
  })

  it('uses unique ids and display names', () => {
    const ids = inputs.map((input) => input.id)
    const names = inputs.map((input) => input.name)

    expect(new Set(ids).size).toBe(inputs.length)
    expect(new Set(names).size).toBe(inputs.length)
  })
})
