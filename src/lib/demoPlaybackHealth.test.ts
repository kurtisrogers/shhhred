import { describe, expect, it } from 'vitest'
import { evaluatePlaybackHealth } from './demoPlaybackHealth'

describe('evaluatePlaybackHealth', () => {
  it('returns idle when playback is not active', () => {
    expect(
      evaluatePlaybackHealth({
        isPlaying: false,
        isActivePlayer: false,
        outputGainValue: 1,
        audioPaused: true,
      }),
    ).toBe('idle')
  })

  it('returns audible for a healthy playing state', () => {
    expect(
      evaluatePlaybackHealth({
        isPlaying: true,
        isActivePlayer: true,
        audioContextState: 'running',
        outputGainValue: 0.7,
        audioPaused: false,
      }),
    ).toBe('audible')
  })

  it('returns silent when the audio context is suspended', () => {
    expect(
      evaluatePlaybackHealth({
        isPlaying: true,
        isActivePlayer: true,
        audioContextState: 'suspended',
        outputGainValue: 0.7,
        audioPaused: false,
      }),
    ).toBe('silent')
  })

  it('returns silent when output gain is muted', () => {
    expect(
      evaluatePlaybackHealth({
        isPlaying: true,
        isActivePlayer: true,
        audioContextState: 'running',
        outputGainValue: 0,
        audioPaused: false,
      }),
    ).toBe('silent')
  })

  it('returns silent when the media element is paused', () => {
    expect(
      evaluatePlaybackHealth({
        isPlaying: true,
        isActivePlayer: true,
        audioContextState: 'running',
        outputGainValue: 0.7,
        audioPaused: true,
      }),
    ).toBe('silent')
  })
})
