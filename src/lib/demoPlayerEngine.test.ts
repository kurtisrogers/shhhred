import { describe, expect, it } from 'vitest'
import {
  audioSourcesMatch,
  createPlayerMountKey,
  NAM_PLAYER_ID,
} from './demoPlayerEngine'

describe('createPlayerMountKey', () => {
  it('keeps a stable key after the engine is ready', () => {
    expect(
      createPlayerMountKey('ready', 'Metalcore - Guitar', 'Vox AC10'),
    ).toBe(NAM_PLAYER_ID)
  })

  it('remounts before init when amp or track selection changes', () => {
    expect(
      createPlayerMountKey('uninitialized', 'Mayer - Guitar', 'Vox AC10'),
    ).toBe('Mayer - Guitar::Vox AC10')

    expect(
      createPlayerMountKey(
        'initializing',
        'Metalcore - Guitar',
        'Peavey 5150 Block Letter (Boosted)',
      ),
    ).toBe('Metalcore - Guitar::Peavey 5150 Block Letter (Boosted)')
  })
})

describe('audioSourcesMatch', () => {
  it('matches absolute and relative urls for the same file', () => {
    expect(
      audioSourcesMatch(
        'https://example.com/shhhred/inputs/metalcore-guitar.wav',
        '/shhhred/inputs/metalcore-guitar.wav',
      ),
    ).toBe(true)
  })

  it('returns false for different files', () => {
    expect(
      audioSourcesMatch(
        '/shhhred/inputs/mayer-guitar.wav',
        '/shhhred/inputs/metalcore-guitar.wav',
      ),
    ).toBe(false)
  })
})
