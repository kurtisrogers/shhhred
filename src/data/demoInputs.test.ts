import { describe, expect, it } from 'vitest'
import { buildDemoInputs } from './demoInputs'

const BASE = '/shhhred/'

describe('buildDemoInputs', () => {
  const inputs = buildDemoInputs(BASE)

  it('includes a curated set of bundled metal, rock, clean, and bass tracks', () => {
    expect(inputs).toHaveLength(15)

    const metal = inputs.filter((input) => input.genre === 'metal')
    const rock = inputs.filter((input) => input.genre === 'rock')
    const clean = inputs.filter((input) => input.genre === 'blues')
    const bass = inputs.filter((input) => input.genre === 'bass')

    expect(metal).toHaveLength(10)
    expect(rock).toHaveLength(3)
    expect(clean).toHaveLength(1)
    expect(bass).toHaveLength(1)
  })

  it('defaults to Mayer - Guitar', () => {
    const defaultInput = inputs.find((input) => input.default)
    expect(defaultInput?.name).toBe('Mayer - Guitar')
    expect(defaultInput?.url).toBe(`${BASE}inputs/mayer-guitar.wav`)
  })

  it('serves every track from the local bundle', () => {
    for (const input of inputs) {
      expect(input.url).toMatch(new RegExp(`^${BASE}inputs/[a-z0-9-]+\\.wav$`))
      expect(input.url).not.toContain('githubusercontent.com')
    }
  })

  it('includes a strong metal selection', () => {
    const metalNames = inputs
      .filter((input) => input.genre === 'metal')
      .map((input) => input.name)

    expect(metalNames).toEqual(
      expect.arrayContaining([
        'Metalcore - Guitar',
        'Decapitated - Guitar',
        'Fast Thrash - Guitar',
        'Hammer Lead - Guitar',
      ]),
    )
  })

  it('uses unique ids and display names', () => {
    const ids = inputs.map((input) => input.id)
    const names = inputs.map((input) => input.name)

    expect(new Set(ids).size).toBe(inputs.length)
    expect(new Set(names).size).toBe(inputs.length)
  })
})
